new Tabular.Table({
    name: 'Files',
    selector: userId => ({
        createdBy: userId
    }),
    collection: Collection.Files,
    responsive: true,
    autoWidth: false,
    columns: [
        { data: 'originalName', title: 'Original name' },
        { data: 'ext', title: 'Original format' },
        { data: 'numeralSize()', title: 'Original size' },
        { data: 'cleanOutputFormat()', title: 'Output format' },
        { data: 'cleanOutputSize()', title: 'Output size' },
        { data: 'state()', title: 'Status' },
        {
            tmpl: Meteor.isClient && Template.profileFileActions,
            tmplContext: doc => ({
                doc
            }),
            title: 'Actions'
        }
    ],
    extraFields: ['id', 'size', 'status', 'isAudio', 'isVideo', 'price', 'outputFormat', 'outputSize']
});
