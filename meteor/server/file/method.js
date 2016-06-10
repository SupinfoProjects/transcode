const fs = Npm.require('fs');
const url = Npm.require('url');

Meteor.methods({
    uploadFromUrl: function (link) {
        if (!Meteor.userId()) {
            throw Meteor.Error('not-authorized', 'Not authorized');
        }

        const data = url.parse(link);
        const format = _.last(data.path.split('.'));

        const extensions = _.union(Meteor.settings.public.formats.audio, Meteor.settings.public.formats.video);
        const accept = new RegExp(`^${extensions.join('|')}$`, 'i');

        if (!accept.test(format)) {
            throw new Meteor.Error('format-invalid', 'Format invalid');
        }

        const future = new Future();
        const id = Random.id();
        const newPath = `${id}.${format}`;
        const originalName = _.last(data.path.split('/'));
        const privateKey = Meteor.user().privateKey;

        const options = {
            directory: Meteor.settings.data,
            filename: newPath,
            timeout: 2 * 60 * 1000 // 2 minutes
        };

        download(link, options, Meteor.bindEnvironment(err => {
            if (err) {
                future.throw(new Meteor.Error(err.toString()));
                return false;
            }

            future.return();
        }));

        let inserted = false;
        let interval;

        const insertFile = () => {
            const filePath = `${Meteor.settings.data}/${newPath}`;
            
            if (!inserted && fs.existsSync(filePath)) {
                inserted = true;
                const fileInfo = fs.statSync(filePath);

                Collection.Files.insert({
                    id,
                    format,
                    originalName,
                    path: `/${newPath}`,
                    size: fileInfo.size,
                    type: mime.lookup(filePath),
                    status: 'new',
                    privateKey
                });

                Meteor.clearInterval(interval);
            }
        };

        interval = Meteor.setInterval(insertFile, 50);
        
        return future.wait();
    },
    convertFile: (tokenId, fileId, outputFormat) => {
        const file = getFile(fileId);
        const chargeId = ChargeHelper.create(tokenId, fileId, Math.round(file.price * 100));

        Collection.Files.update(fileId, {
            $set: {
                chargeId,
                outputFormat,
                paid: true,
                status: 'processing'
            }
        });

        const client = celery.createClient({
            CELERY_BROKER_URL: Meteor.settings.broker,
            CELERY_RESULT_BACKEND: 'amqp'
        });

        client.on('error', err => {
            console.log(err);
        });

        client.on('connect', Meteor.bindEnvironment(() => {
            const inputPath = `/data${file.path}`;
            
            client.call('core.process_file', [file.isVideo, inputPath, outputFormat], Meteor.bindEnvironment(result => {
                if (!result || result.status !== 'SUCCESS') {
                    console.log('process file not succeed', result);
                    throw new Meteor.Error('convert-error', 'Conversion error occured');
                }

                const outputPath = result.result;
                
                if (fs.existsSync(inputPath)) {
                    fs.unlinkSync(inputPath);
                }

                if (fs.existsSync(outputPath)) {
                    const newPath = outputPath.replace('/tmp', '');
                    fs.renameSync(outputPath, newPath);
                }
                
                console.log('outputPath:', outputPath);
                const fileInfo = fs.statSync(outputPath);

                Collection.Files.update(fileId, {
                    $set: {
                        status: 'converted'
                    }
                });

                const size = fileInfo.size - file.size;

                Meteor.users.update(Meteor.userId(), {
                    $inc: {
                        'profile.diskUsage': size
                    }
                });

                client.end();
            }));
        }));
    },
    deleteFile: (fileId) => {
        const file = getFile(fileId);
        const filePath = Meteor.settings.data + file.path;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const size = file.size;

        Collection.Files.remove(fileId);
        Meteor.users.update(Meteor.userId(), {
            $inc: {
                'profile.diskUsage': -size
            }
        });
    }
});

function getFile(fileId) {
    if (!Meteor.userId()) {
        throw Meteor.Error('not-authorized', 'Not authorized');
    }

    const file = Collection.Files.findOne(fileId);

    if (!file) {
        throw Meteor.Error('file-not-found', 'File not found');
    }

    if (file.createdBy !== Meteor.userId()) {
        throw Meteor.Error('not-authorized', 'Not authorized');
    }

    if (file.status === 'processing') {
        throw Meteor.Error('not-authorized', 'Not authorized');
    }
    
    return file;
}
