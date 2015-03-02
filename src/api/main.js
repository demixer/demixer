import {Injector} from 'di';
import {MysqlDatabase} from '../database/mysql_database';
import {RestifyDriver} from './driver/restify_driver';
import {Server} from './server';

function main () {
    var injector,
        server;

    injector = new Injector([
        MysqlDatabase, 
        RestifyDriver
    ]);

    server = injector.get(Server);
    server.start();
}

main();
