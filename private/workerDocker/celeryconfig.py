# Connection Strings
BROKER_URL = 'amqp://root:root@192.168.56.31:5672'
CELERY_RESULT_BACKEND = 'mongodb://mongo1,mongo2,mongo3/transcode?replicaSet=transcode'

# Celery Settings
CELERY_TIMEZONE = 'Europe/Paris'
CELERY_IMPORTS = ("tasks")
CELERY_SEND_EVENTS = True
CELERY_TASK_RESULT_EXPIRES = True
