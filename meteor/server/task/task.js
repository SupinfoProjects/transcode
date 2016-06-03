Meteor.publish('schema.task.file', function (ids) {
   return Files.find({
      _id: {
         $in: ids
      },
      createdBy: this.userId
   })
});
