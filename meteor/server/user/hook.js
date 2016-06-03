Meteor.users.before.insert(function (userId, doc) {
    if (!doc.profile)
        doc.profile = {};
    
    doc.profile.diskUsage = 0;
    doc.privateKey = Random.id(255);
});
