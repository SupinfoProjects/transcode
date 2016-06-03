NewFile = class NewFile extends File {
    /**
     * Instantiate new file
     * @param input {Input}
     * @param file {Blob}
     */
    constructor (input, file) {
        super(input);

        this.computation = null;
        this.file = file;

        if (this.isImage()) {
            this.render();
        }

        if (input.automaticUpload) {
            this.upload();
        }
    }

    /**
     * Return true if the received file is the same
     * @param file {Blob}
     * @returns {boolean}
     */
    equals (file) {
        let self = this;

        return self.equalityKeys.every(function (key) {
            return self.file[key] === file[key];
        });
    }

    /**
     * Render image from blob
     */
    render () {
        let reader = new FileReader();

        reader.onload = (function (self) {
            return function (event) {
                self.src = event.target.result;
                self.input.dependency.changed();
            };
        })(this);

        reader.readAsDataURL(this.file);
    }

    /**
     * Upload file from blob
     */
    upload () {
        let self = this;

        self.input.collection.insert(self.file, function (error, doc) {
            if (error) {
                self.error = error;
                return false;
            }

            self.id = doc._id;
            self.computation = Meteor.autorun(function () {
                self.doc = self.input.collection.findOne(self.id);
                self.input.dependency.changed();

                if (doc.isUploaded()) {
                    self.computation.stop();
                }
            });
        });
    }

    /**
     * Upload file synchronously
     */
    uploadSync () {
        let doc = this.input.collection.insert(this.file);
        this.id = doc._id;
    }
};
