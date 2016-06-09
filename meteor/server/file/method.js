import fs from 'fs';
import url from 'url';
import mime from 'mime';
import download from 'download-file';
import Future from 'fibers/future';

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

        // TODO: call celery
    },
    deleteFile: (fileId) => {
        const file = getFile(fileId);
        const filePath = Meteor.settings.data + file.path;

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, error => {
                if (error) {
                    throw new Meteor.Error(error.toString());
                }
            });
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
