Collection.Files.before.insert(function (userId, doc) {
    const privateKey = doc.privateKey;
    delete doc.privateKey;

    const user = Meteor.users.findOne({
        privateKey
    }, {
        fields: {
            _id: 1
        }
    });

    doc.createdBy = user._id;
    doc.associatedToTask = false;
});

Collection.Files.after.insert(function (userId, doc) {
    Meteor.users.update(doc.createdBy, {
        $inc: {
            'profile.diskUsage': doc.size // octets
        }
    });
});
