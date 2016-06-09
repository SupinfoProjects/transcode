Template.profileFileActions.events({
    'click .convert': function (event, template) {
        const button = $(event.target);

        if (button.is(':disabled')) {
            return false;
        }

        button.prop('disabled', true);

        const modal = ReactiveModal.initDialog({
            template: Template.profileAskFormat,
            title: 'Convert your file',
            removeOnHide: true,
            buttons: {
                cancel: {
                    class: 'btn-danger',
                    label: 'Cancel'
                },
                convert: {
                    class: 'btn-success',
                    label: 'Convert',
                    closeModalOnClick: false
                }

            },
            doc: template.data
        });

        modal.buttons.convert.on('click', () => {
            const fileId = template.data.doc._id;
            const outputFormat = $(modal.modalTarget).find('#output-format').val();
            const price = template.data.doc.price;

            StripeHandler.checkout(fileId, outputFormat, price, () => {
                modal.hide();
                swal(
                    'Task started',
                    'Your payment has been processed successfully. Your file is being converted.',
                    'success'
                );
            });
        });

        modal.show();
    },
    'click .delete': function (event, template) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this file!", 
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm){
            if (isConfirm) {
                swal.disableButtons();
                Meteor.call('deleteFile', template.data.doc._id, error => {
                    swal.enableButtons();

                    if (error) {
                        swal('Error!', error.reason, "error");
                    } else {
                        swal("Deleted!", "Your file has been deleted.", "success");
                    }
                });
            } else {
                swal("Cancelled", "Your file is safe", "error");
            }
        });
    }
});

Template.profileFileActions.helpers({
    processing: function () {
        return this.doc.status === 'processing';
    },
    converted: function () {
        return this.doc.status === 'converted';
    }
});
