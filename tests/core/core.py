import os
import re
import shlex
from subprocess import PIPE, Popen, DEVNULL, check_call

import sys
from celery import Celery
from celery.result import ResultSet

from worker.worker import process_video_part

app = Celery('core', backend='amqp', broker='amqp://')
WORKERS = 10


# Video and audio
def get_total_workers():
    return WORKERS


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


# Video
@app.task(name='core.process_video')
def process_video(input_path, output_format):
    video_length = get_file_length(input_path)
    part_length = int(video_length / WORKERS)

    output_part_paths = convert_video(input_path, output_format, video_length, part_length)
    output_path = concatenate_video_parts(input_path, output_format, output_part_paths)

    return output_path


def convert_video(input_path, output_format, video_length, part_length):
    rs = ResultSet([])

    for i in range(WORKERS):
        start_at = i * part_length
        stop_at = start_at + part_length if i != WORKERS - 1 else video_length
        print("worker {} will process from {}s to {}s".format(i + 1, start_at, stop_at))
        rs.add(process_video_part.delay(input_path, output_format, start_at, stop_at))

    return rs.get()


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

    template = "ffmpeg -f concat -safe 0 -i {} -c copy -strict -2 {}"
    command = template.format(parts_list_path, output_path)
    check_call(shlex.split(command), universal_newlines=True, stdout=DEVNULL, stderr=DEVNULL)

    os.remove(parts_list_path)

    for output_part_path in output_part_paths:
        os.remove(output_part_path)

    return output_path


# Audio
@app.task(name='core.process_audio')
def process_audio(input_path, output_format):
    audio_length = get_file_length(input_path)
    part_length = int(audio_length / WORKERS)

    output_part_paths = convert_audio(input_path, output_format, audio_length, part_length)
    output_path = concatenate_audio_parts(input_path, output_format, output_part_paths)

    return output_path
