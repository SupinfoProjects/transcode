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

Security
    .permit('download')
    .collections(Files)
    .ifIsOwner()
    .allowInClientCode();

Security
    .permit(['insert'])
    .collections([Files, Files.files])
    .ifLoggedIn()
    .allowInClientCode();

Security
    .permit(['download', 'update', 'remove'])
    .collections([Files, Files.files])
    .ifLoggedIn()
    .ifIsOwner()
    .allowInClientCode();
