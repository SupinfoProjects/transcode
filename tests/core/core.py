import os
import re
import shlex
from subprocess import PIPE, Popen
from subprocess import check_call
from celery import Celery
from worker import worker

app = Celery('core', backend='rpc://', broker='amqp://')

app.conf.CELERY_TASK_SERIALIZER = 'json'
app.conf.CELERY_ACCEPT_CONTENT = ['json']
app.conf.CELERY_RESULT_SERIALIZER = 'json'
app.conf.CELERY_TIMEZONE = 'Europe/Paris'
app.conf.CELERY_ENABLE_UTC = True
app.conf.CELERY_REDIRECT_STDOUTS = True
app.conf.CELERY_REDIRECT_STDOUTS_LEVEL = 'DEBUG'

WORKERS = 10


@app.task
def process_video(input_path, output_format):
    video_length = get_video_length(input_path)
    part_length = int(video_length / WORKERS)

    output_part_paths = convert_video(input_path, output_format, video_length, part_length)
    output_path = concatenate_video_parts(input_path, output_format, output_part_paths)

    return output_path


def get_video_length(input_path):
    ffmpeg_info = Popen(["ffmpeg", "-i", input_path], stdout=PIPE, stderr=PIPE, universal_newlines=True)
    output = Popen(["grep", 'Duration'], stdin=ffmpeg_info.stderr, stdout=PIPE, universal_newlines=True)
    ffmpeg_info.stdout.close()

    regex = re.compile('Duration: (\d{2}):(\d{2}):(\d{2})(\.\d+),')
    matches = regex.search(output.stdout.read())

    if matches:
        hours = float(matches.group(1))
        minutes = float(matches.group(2))
        seconds = float(matches.group(3))
        milliseconds = float(matches.group(4))

        return hours * 3600 + minutes * 60 + seconds + milliseconds
    else:
        raise Exception("Video length not found")


def convert_video(input_path, output_format, video_length, part_length):
    output_part_paths = []

    for i in range(WORKERS):
        start_at = i * part_length
        stop_at = start_at + part_length if i != WORKERS - 1 else video_length
        print("worker {} will process from {}s to {}s".format(i + 1, start_at, stop_at))
        output_part_path = worker.process_video_part(input_path, output_format, start_at, stop_at)
        output_part_paths.append(output_part_path)

    return output_part_paths


def create_parts_list(input_name, output_part_paths):
    parts_list_path = "{}/.tmp/{}.txt".format(os.getcwd(), input_name)
    file = open(parts_list_path, 'w')

    for output_part_path in output_part_paths:
        file.write("file '{}'\n".format(output_part_path))

    file.close()

    return parts_list_path


def concatenate_video_parts(input_path, output_format, output_part_paths):
    base_name = os.path.basename(input_path)
    input_name = os.path.splitext(base_name)[0]

    parts_list_path = create_parts_list(input_name, output_part_paths)
    output_path = "{}/.tmp/{}.{}".format(os.getcwd(), input_name, output_format)

    template = "ffmpeg -f concat -i {} -c copy -strict -2 {}"
    command = template.format(parts_list_path, output_path)
    check_call(shlex.split(command), universal_newlines=True)

    os.remove(parts_list_path)

    for output_part_path in output_part_paths:
        os.remove(output_part_path)

    return output_path
