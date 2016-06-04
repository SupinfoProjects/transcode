import fs from 'fs';
import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
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
        acceptFileTypes: /^.+\.(avi|wmv|flv|mpe?g|mp4|mkv|webm|ogg|ogv|ogc|mov|3gp|aac|mp3|oga|wav|wma)$/i
    });
});
