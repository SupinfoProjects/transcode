Template.profileFileActions.events({
    'click .convert': function (event, template) {
        const button = $(event.target);

        if (button.is(':disabled')) {
            return false;
        }

        button.prop('disabled', true);

        swal({
            title: "In wich format ?",
            text: "Refer to the table below (avi, wmv, flv...)",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "avi"
        }, function(inputValue){
            if (inputValue === 'mp4') { // TODO, check if good format
                Meteor.call('convertFile', template.data.doc._id, inputValue, error => {
                    if (error) {
                        swal('Error!', error.reason, "error");
                        console.log(error);
                    } else {
                        swal('Nice, check your files!', `We are processing... Your file will be "${inputValue}" at any moment`);
                    }
                });
            }
            else if (inputValue === "") {
                swal.showInputError("You need to write something!");
            }
            else if (inputValue === "toto") {
                swal.showInputError("We can't convert your file in that format");
            }

            button.prop('disabled', false);
            return false;
        });
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
                Meteor.call('deleteFile', template.data.doc._id, error => {
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
