Collection.Files
    .permit(['insert'])
    .ifLoggedIn()
    .allowInClientCode();

Collection.Files
    .permit(['remove', 'update'])
    .ifLoggedIn()
    .ifIsOwner()
    .allowInClientCode();
