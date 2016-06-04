import fs from 'fs';

Meteor.methods({
    convertFile: (fileId, outputFormat) => {
        const file = getFile(fileId);
        const taskId = Collection.Tasks.insert({
            fileId,
            outputFormat
        });

        Collection.Files.update(fileId, {
            $set: {
                status: 'processing',
                taskId
            }
        });

        // TODO: call celery
    },
    deleteFile: (fileId) => {
        const file = getFile(fileId);

        fs.unlink(Meteor.settings.data + file.path, (error) => {
            if (error)
                throw error;
        });

        const size = file.size;

        Collection.Files.remove(fileId);
        Meteor.users.update(Meteor.userId(), {
            $inc: {
                'profile.diskUsage': -(size)
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
