Collection.Tasks.before.insert(function (userId, doc) {
    doc.createdBy = userId;
});

Files.files.before.insert(function (userId, doc) {
    doc.createdBy = userId;
});
