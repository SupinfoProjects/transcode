Collection.Tasks.before.insert(function (userId, doc) {
    doc.createdBy = userId;
});
