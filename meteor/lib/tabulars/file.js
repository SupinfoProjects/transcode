new Tabular.Table({
    name: "Files",
    selector: function () {
        return {createdBy: Meteor.userId()};
    },
    collection: Collection.Files,
    columns: [
        {data: "originalName", title: "Name"},
        {data: "type", title: "Type"},
        {data: "copies", title: "Copies Available"},
        {
            tmpl: Meteor.isClient && Template.profileFileActions
        }
    ]
});
