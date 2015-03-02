import {Provide} from 'di';
import {Driver} from './driver';
import restify from 'restify';

@Provide(Driver)
export class RestifyDriver {
    constructor () {
        this.server = restify.createServer();
        this.server.use(restify.bodyParser());
    }

    listen (port) {
        this.server.listen(port);
    }

    post (path, resource) {
        this.server.post(path, function (req, res, next) {
            resource.post(req, res, next);
        });
    }
}
