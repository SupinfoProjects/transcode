Security.defineMethod('ifIsOwner', {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId, doc) {
        return !_.has(doc, 'createdBy') || userId !== doc.createdBy;
    }
});
