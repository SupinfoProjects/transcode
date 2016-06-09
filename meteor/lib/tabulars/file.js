new Tabular.Table({
    name: 'Files',
    selector: userId => ({
        createdBy: userId
    }),
    collection: Collection.Files,
    columns: [
        { data: 'originalName', title: 'Name' },
        { data: 'ext', title: 'Format' },
        { data: 'numeralSize()', title: 'Size' },
        { data: 'state()', title: 'Status' },
        {
            tmpl: Meteor.isClient && Template.profileFileActions,
            tmplContext: doc => ({
                doc
            }),
            title: 'Actions'
        }
    ],
    extraFields: ['size', 'status', 'isAudio', 'isVideo', 'price']
});
