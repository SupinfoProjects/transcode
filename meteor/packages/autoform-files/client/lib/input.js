Input = class Input {
    /**
     * Instantiate new input
     * @param options {Object}
     */
    constructor (options) {
        this.dependency = new Tracker.Dependency();
        this.files = [];

        this.collection = options.collection;
        this.automaticUpload = options.automaticUpload;
        this.automaticRemove = options.automaticRemove;
        this.multiple = options.multiple;
        this.subscription = options.subscription;

        // if (options.value) {
        //     this.initializeValue(options.value);
        // }
    }

    /**
     * Initialize input with uploaded files
     * @param value {String|Array}
     */
    initializeValue (value) {
        const self = this;
        let changed = false;

        // Multiple input, find uploaded files
        if (self.multiple) {
            const docs = self.collection.find({
                _id: {
                    $in: value
                }
            }).fetch();

            if (docs.length) {
                docs.forEach(function (doc) {
                    self.files.push(new Smalt.AutoForm.Type.UploadedFile(self, doc));
                });

                changed = true;
            }
        }

        // Else find uploaded file
        else {
            const doc = self.collection.findOne(value);

            if (doc) {
                self.files.push(new Smalt.AutoForm.Type.UploadedFile(self, doc));
                changed = true;
            }
        }

        if (changed) {
            this.dependency.changed();
        }
    }

    /**
     * Add new file to input
     * @param file {Blob}
     */
    addFile (file) {
        if (!this.containsFile(file)) {
            this.files.push(new Smalt.AutoForm.Type.NewFile(this, file));
        }
    }

    /**
     * Return true if the input already contains the received file
     * @param inputFile
     * @returns {boolean}
     */
    containsFile (inputFile) {
        return this.files.some(function (file) {
            return file.equals(inputFile);
        });
    }

    /**
     * Remove the file which match the properties
     * @param properties {Object} properties for _.findWhere method
     * @returns {boolean}
     */
    removeFile (properties) {
        if (!properties) {
            return false;
        }

        let file = _.findWhere(this.files, properties);

        if (!file) {
            return false;
        }

        file.remove();
        this.files.splice(this.files.indexOf(file), 1);
        this.dependency.changed();
    }

    /**
     * Return files reactively
     * @returns {Array}
     */
    getFiles () {
        this.dependency.depend();
        return this.files;
    }

    /**
     * Reset input
     */
    reset () {
        this.files.forEach(function (file) {
            file.remove();
        });

        this.files = [];
        this.dependency.changed();
    }

    /**
     * Return files IDs
     * @returns {Array}
     */
    finalUpload () {
        let ids = [];

        this.files.forEach(function (file) {
            if (!file.isNew() && !file.id) {
                file.uploadSync();
            }

            ids.push(file.id);
        });

        return ids;
    }

    /**
     * Remove files which have been marked as "to remove"
     */
    finalRemove () {
        this.files.forEach(function (file) {
            if (file.toRemove) {
                file.remove(true);
            }
        });
    }
};
