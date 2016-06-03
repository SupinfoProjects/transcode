Package.describe({
    name: 'transcode:autoform-files',
    version: '0.0.1',
    summary: 'Files upload input for autoform'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.export('Smalt', 'client');

    api.use([
        'ecmascript',
        'underscore',
        'templating',
        'aldeed:autoform@5.8.1',
        'isotope:isotope@2.1.0_1',
        'smaltcreation:imagesloaded@4.1.0'
    ], 'client');

    api.addFiles([
        // Lib
        'client/lib/file/file.js',
        'client/lib/file/new.js',
        'client/lib/file/uploaded.js',
        'client/lib/input.js',
        'client/lib/export.js',
        // Input
        'client/input/input.html',
        'client/input/input.js',
        // Preview
        'client/preview/preview.html',
        'client/preview/preview.js',
        'client/preview/preview.css'
    ], 'client');
});
