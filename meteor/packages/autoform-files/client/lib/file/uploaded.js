UploadedFile = class UploadedFile extends File {
    /**
     * Instantiate uploaded file
     * @param input {Input}
     * @param doc {Object} Mongo document from Files collection
     */
    constructor (input, doc) {
        super(input, doc);
    }

    /**
     * Return true if the received file is the same
     * @param doc {Object} Mongo document from the Images collection
     * @returns {boolean}
     */
    equals (doc) {
        let self = this;

        return self.equalityKeys.every(function (key) {
            return self.doc.original[key] === doc[key];
        });
    }
};
