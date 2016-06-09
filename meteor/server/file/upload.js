import fs from 'fs';
import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    const extensions = _.union(Meteor.settings.public.formats.audio, Meteor.settings.public.formats.video);

    UploadServer.init({
        tmpDir: `${Meteor.settings.data}/tmp`,
        uploadDir: Meteor.settings.data,
        validateRequest: req => req.url === '/' ? null : '404 - File not found',
        checkCreateDirectories: true,
        finished: function(fileInfo, formData) {
            const id = Random.id();
            const format = _.last(fileInfo.name.split('.'));
            const newPath = `/${id}.${format}`;

            fs.renameSync(`${Meteor.settings.data}${fileInfo.path}`, `${Meteor.settings.data}${newPath}`);
            
            Collection.Files.insert({
                id,
                format,
                originalName: fileInfo.name,
                path: newPath,
                size: fileInfo.size,
                type: fileInfo.type,
                status: 'new',
                privateKey: formData.privateKey
            });
            
        },
        acceptFileTypes: new RegExp(`^.+\.(${extensions.join('|')})$`, 'i')
    });
});
