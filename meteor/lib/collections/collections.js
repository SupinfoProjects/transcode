Collection = {
    Tasks: new Mongo.Collection('tasks'),
    Files: new Mongo.Collection('files'),
    Charges: new Meteor.Collection('charges')
};

Collection.Files.helpers({
    state: function () {
        console.log(this);
        switch (this.status) {
            case 'new':
                return 'Not converted';
            case 'processing':
                return 'Processing...';
            case 'converted':
                return 'Converted';
            default:
                return 'No information';
        }
    },
    numeralSize: function () {
        console.log(this);
        return numeral(this.size).format('0 b');
    }
});
