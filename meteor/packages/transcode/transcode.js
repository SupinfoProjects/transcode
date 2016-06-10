import mime from 'mime';
import download from 'download-file';
import Future from 'fibers/future';
import celery from 'node-celery';

export const modules = {
    mime,
    download,
    Future,
    celery
};
