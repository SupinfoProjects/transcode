import fs from 'fs';

if (Meteor.isServer) {
    const fail = response => {
        response.statusCode = 404;
        response.end('<h1>404 - File not found</h1>');
    };

    const dataFile = function() {
        const file = `${Meteor.settings.data}/${this.params.name}`;

        let stat = null;
        try {
            stat = fs.statSync(file);
        } catch (error) {
            return fail(this.response);
        }

        this.response.writeHead(200, {
            'Content-Type': stat.type,
            'Content-Disposition': `attachment; filename=${this.params.name}`,
            'Content-Length': stat.size
        });

        fs.createReadStream(file).pipe(this.response);
    };

    Router.route('/file/:name', dataFile, {where: 'server'});
}
