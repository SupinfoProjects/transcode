if (Meteor.isServer) {
    const fs = Npm.require('fs');
    const fail = response => {
        response.statusCode = 404;
        response.end('<h1>404 - File not found</h1>');
    };

    Router.route('/file/:name', function () {
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
    }, {where: 'server'});
}
