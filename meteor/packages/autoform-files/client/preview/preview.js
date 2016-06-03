Template.afInputSmaltFilePreview.events({
    'click .remove': function (event, template) {
        event.preventDefault();

        template.data.input.removeFile(
            template.data.file.id
                ? { id: template.data.file.id }
                : { src: template.data.file.src }
        );
    }
});
