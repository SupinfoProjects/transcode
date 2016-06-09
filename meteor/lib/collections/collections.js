Collection = {
    Files: new Mongo.Collection('files'),
    Charges: new Meteor.Collection('charges')
};

Collection.Files.helpers({
    state: function () {
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
        return numeral(this.size).format('0.00 b');
    }
});
