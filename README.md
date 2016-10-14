# Transcode
Group Projects M.Sc.1 - Transcode

In the Transcode directory :

`# docker-compose up -d`

To get the IP of the web app

`# docker inspect transcode_balancer_1  | grep "\"IPAddress\":"`

To scale your application with docker

`# docker-compose	scale web=<web_nb> core=<core_nb> worker=<worker_nb>`

You can access your app on the IP address of the web app, you can also access the HAProxy dashboard on the port 3000 and root:root as user and password.

Full documentation : https://github.com/wdhif/transcode/tree/master/doc
