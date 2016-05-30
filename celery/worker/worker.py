import os
import shlex
from subprocess import check_call
from celery import Celery

app = Celery('worker', backend='rpc://', broker='amqp://')

app.conf.CELERY_TASK_SERIALIZER = 'json'
app.conf.CELERY_ACCEPT_CONTENT = ['json']
app.conf.CELERY_RESULT_SERIALIZER = 'json'
app.conf.CELERY_TIMEZONE = 'Europe/Paris'
app.conf.CELERY_ENABLE_UTC = True
app.conf.CELERY_REDIRECT_STDOUTS = True
app.conf.CELERY_REDIRECT_STDOUTS_LEVEL = 'DEBUG'


@app.task
def process_video_part(input_path, output_format, start_at, stop_at):
    input_part_path = extract_video_part(input_path, start_at, stop_at)
    output_part_path = convert_video_part(input_part_path, output_format)

    return output_part_path


def extract_video_part(input_path, start_at, stop_at):
    base_name = os.path.basename(input_path)
    input_name = os.path.splitext(base_name)[0]
    input_format = os.path.splitext(base_name)[1]

    input_part_path = "{}/.tmp/{}-{}{}".format(os.getcwd(), input_name, start_at, input_format)

    template = "ffmpeg -y -i {} -ss {} -t {} -vcodec copy -acodec copy {}"
    command = template.format(input_path, start_at, stop_at - start_at, input_part_path)
    check_call(shlex.split(command), universal_newlines=True)

    return input_part_path


def convert_video_part(input_part_path, output_format):
    base_name = os.path.basename(input_part_path)
    input_name = os.path.splitext(base_name)[0]

    output_part_path = "{}/.tmp/{}.{}".format(os.getcwd(), input_name, output_format)

    template = "ffmpeg -y -i {} -qscale 0 -strict -2 {}"
    command = template.format(input_part_path, output_part_path)
    check_call(shlex.split(command), universal_newlines=True)

    os.remove(input_part_path)

    return output_part_path
