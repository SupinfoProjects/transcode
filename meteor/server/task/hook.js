Collection.Tasks.before.insert(function (userId, doc) {
    doc.createdBy = userId;
    doc.status = 'submitted';
});
