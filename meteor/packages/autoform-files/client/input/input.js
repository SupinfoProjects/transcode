const DATA_KEY_VALUE = 'value';

AutoForm.addInputType('smalt-file', {
    template: 'afInputSmaltFile',
    contextAdjust: function (context) {
        // Input options
        let options = _.pick(context.atts, [
            'collection',
            'automaticUpload',
            'automaticRemove',
            'multiple',
            'subscription'
        ]);

        context.input = new Smalt.AutoForm.Input.File(options);

        // HTML input attributes
        context.inputAttributes = _.pick(context.atts, [
            'data-schema-key',
            'id',
            'multiple',
            'name',
            'accept'
        ]);

        if (context.inputAttributes.multiple) {
            context.inputAttributes.multiple = 'multiple';
        } else {
            delete context.inputAttributes.multiple;
        }

        // "Select files" button
        context.btnClass = context.atts.btnClass || 'btn btn-default';
        context.placeholder = context.atts.placeholder || 'Select files';

        return context;
    },
    valueOut: function () {
        return this.data(DATA_KEY_VALUE);
    }
});

Template.afInputSmaltFile.onCreated(function () {
    const self = this;
    let initialized = false;

    // Return files IDs
    self.getFilesIds = function () {
        const values = self.data.input.getFiles().map(function (file) {
            const id = file.get();

            if (id) {
                return id;
            }
        });

        if (!initialized && self.data.value) {
            if (self.data.input.multiple) {
                self.data.value.forEach(id => {
                    values.push(id);
                });
            } else {
                values.push(self.data.value);
            }
        }

        return values;
    };

    // Subscription
    self.autorun(function () {
        self.subscribe(self.data.input.subscription, self.getFilesIds(), {
            onReady: function () {
                if (!initialized && self.data.value) {
                    initialized = true;
                    self.data.input.initializeValue(self.data.value);
                }
            }
        });
    });
});


Template.afInputSmaltFile.onRendered(function () {
    let self = this;

    // Isotope
    let grid = $('.af-smalt-previews');
    let initialized = false;

    // Run on value changes
    self.autorun(function () {
        let ids = self.getFilesIds();

        // Update data for output
        let input = $('#' + self.data.atts.id);

        if (self.data.input.multiple) {
            input.data(DATA_KEY_VALUE, ids);
        } else if (ids.length === 1) {
            input.data(DATA_KEY_VALUE, ids[0]);
        } else {
            input.data(DATA_KEY_VALUE, null);
        }

        // Destroy Isotope
        if (initialized) {
            grid.isotope('destroy');
        } else {
            initialized = true;
        }

        // Initialize Isotope
        grid.isotope({
            columnWidth: 200,
            rowHeight: 150
        });

        // Update Isotope on window resize
        grid.isotope('bindResize');

        // Update Isotope when an image is loaded
        grid.imagesLoaded().progress(function () {
            grid.isotope('layout');
        });
    });
});

Template.afInputSmaltFile.events({
    'click .af-smalt-add-files': function (event, template) {
        $('#' + template.data.atts.id).click();
    },
    'change input[type="file"]': function (event, template) {
        // Reset if not multiple
        if (!template.data.atts.multiple) {
            template.data.input.reset();
        }

        // Process files
        FS.Utility.eachFile(event, function (file) {
            template.data.input.addFile(file);
        });

        // Reset file input
        $(event.target).val('');
    }
});
