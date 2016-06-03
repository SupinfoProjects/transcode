Collection.Files.after.insert(function (userId, doc) {
    console.log(doc, userId);
    //TODO : find why userId is undefined
    Meteor.users.update(userId, {
        $inc: {
            'profile.diskUsage': doc.size //octets
        }
    });
});
