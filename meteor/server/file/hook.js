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
    doc.status = 'new';
    doc.ext = _.last(doc.originalName.split('.'));

    doc.isAudio = _.contains(Meteor.settings.public.formats.audio, doc.ext);
    doc.isVideo = _.contains(Meteor.settings.public.formats.video, doc.ext);

    let price = doc.size / 1048576 * 0.001;

    if (price < 0.5) {
        price = 0.5;
    }

    doc.price = price.toFixed(2);
});

Collection.Files.after.insert(function (userId, doc) {
    Meteor.users.update(doc.createdBy, {
        $inc: {
            'profile.diskUsage': doc.size // octets
        }
    });
});
