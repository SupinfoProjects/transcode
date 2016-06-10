Package.describe({
  name: 'transcode',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');

  Npm.depends({
    'download-file': '0.1.5',
    fibers: '1.0.13',
    hiredis: '0.4.1',
    mime: '1.3.4',
    'node-celery': '0.2.6'
  });
  
  api.use('ecmascript');
  api.mainModule('transcode.js', 'server');
});
