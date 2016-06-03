Security.defineMethod('ifIsOwner', {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId, doc) {
        console.log(doc);
        return !_.has(doc, 'createdBy') || userId !== doc.createdBy;
    }
});

Collection.Tasks
    .permit(['insert'])
    .ifLoggedIn()
    .allowInClientCode();

Collection.Tasks
    .permit(['remove', 'update'])
    .ifLoggedIn()
    .ifIsOwner()
    .allowInClientCode();
