Meteor.methods({
    convertFile: (fileId, outputFormat) => {
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

        if (file.associatedToTask) {
            throw Meteor.Error('not-authorized', 'Not authorized');
        }

        const taskId = Collection.Tasks.insert({
            fileId,
            outputFormat
        });

        Collection.Files.update(fileId, {
            $set: {
                associatedToTask: true,
                taskId
            }
        });

        // TODO: call celery
    }
});
