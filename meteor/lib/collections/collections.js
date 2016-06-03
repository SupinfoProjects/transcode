Collection = {
    Tasks: new Mongo.Collection('tasks'),
    Charges: new Meteor.Collection('charges')
};

Files = new FS.Collection("files", {
    stores: [new FS.Store.FileSystem("files"/*, {path: Meteor.settings.data}*/)]
});

Collection.Tasks.attachSchema(new SimpleSchema({
    file: {
        type: String,
        autoform: {
            type: 'smalt-file',
            collection: Files,
            automaticUpload: true,
            automaticRemove: true,
            multiple: false,
            subscription: 'schema.task.file',
            accept: 'video/*,audio/*'
        }
    },
    createdBy: {
        type: String
    }
}));
