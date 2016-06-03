File = class File {
    /**
     * Instantiate new file
     * @param input {Input}
     * @param doc {Object} Mongo document from Files collection
     */
    constructor (input, doc = null) {
        this.input = input;
        this.doc = doc;
        this.id = doc ? doc._id : null;
        this.src = doc ? doc.url() : null;
        this.error = false;
        this.toRemove = false;

        // Keys used inside "equals" methods
        this.equalityKeys = ['name', 'size', 'type'];
    }

    /**
     * Return file ID
     * @returns {String}
     */
    get () {
        return this.id;
    }

    /**
     * Return true if the file is new
     * @returns {boolean}
     */
    isNew () {
        return this instanceof Smalt.AutoForm.Type.NewFile;
    }

    /**
     * Return true if the file is an image
     * @returns {boolean}
     */
    isImage () {
        return this.doc
            ? this.doc.isImage()
            : this.file
                ? this.file.type.startsWith('image/')
                : false;
    }

    getName () {
        return this.doc
            ? this.doc.original.name
            : this.file
                ? this.file.name
                : null;
    }

    /**
     * Remove the file, or mark it as "to remove"
     * @param force If true, remove the file even if the automatic upload is disabled
     */
    remove (force = false) {
        // If the file has been uploaded
        if (this.doc) {
            // Automatic remove enabled, remove the file immediately
            if (force || this.input.automaticRemove) {
                this.input.collection.remove(this.doc._id);
            }

            // Else, mark this file as "to remove" in order to remove it later
            else {
                this.toRemove = true;
            }
        }
    }
};
