import os
import re
import shlex
from subprocess import PIPE, Popen, DEVNULL, check_call

from celery import Celery
from celery.result import ResultSet

from worker.worker import process_part

app = Celery('core', backend='amqp', broker='amqp://')
app.conf.update(
    CELERY_TASK_SERIALIZER='json',
    CELERY_RESULT_SERIALIZER='json'
)


def get_total_workers():
    return 2


def get_file_length(input_path):
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
        raise Exception("File length not found {}".format(input_path))


@app.task(name='core.process_file')
def process_file(is_video, input_path, output_format):
    file_length = get_file_length(input_path)
    part_length = int(file_length / get_total_workers())

    output_part_paths = convert_file(is_video, input_path, output_format, file_length, part_length)
    output_path = concatenate_parts(input_path, output_format, output_part_paths)

    return output_path


def convert_file(is_video, input_path, output_format, video_length, part_length):
    rs = ResultSet([])

    for i in range(get_total_workers()):
        start_at = i * part_length
        stop_at = start_at + part_length if i != get_total_workers() - 1 else video_length
        print("worker {} will process from {}s to {}s".format(i + 1, start_at, stop_at))
        rs.add(process_part.delay(is_video, input_path, output_format, start_at, stop_at))

    return rs.get()


def create_parts_list(input_name, output_part_paths):
    parts_list_path = "/data/tmp/{}.txt".format(input_name)
    file = open(parts_list_path, 'w')

    for output_part_path in output_part_paths:
        file.write("file '{}'\n".format(output_part_path))

    file.close()

    return parts_list_path


def concatenate_parts(input_path, output_format, output_part_paths):
    base_name = os.path.basename(input_path)
    input_name = os.path.splitext(base_name)[0]

    parts_list_path = create_parts_list(input_name, output_part_paths)
    output_path = "/data/tmp/{}.{}".format(input_name, output_format)

    template = "ffmpeg -f concat -safe 0 -i {} -c copy -strict -2 {}"
    command = template.format(parts_list_path, output_path)
    check_call(shlex.split(command), universal_newlines=True, stdout=DEVNULL, stderr=DEVNULL)

    os.remove(parts_list_path)

    for output_part_path in output_part_paths:
        os.remove(output_part_path)

    return output_path
