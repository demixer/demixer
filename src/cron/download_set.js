import {Injector} from 'di';
import {Database} from '../database/database';
import {MysqlDatabase} from '../database/mysql_database';
import {Promise} from 'bluebird';
import {SetDal} from '../dal/set_dal';

function main () {
    var database,
        injector,
        promise,
        setDal;

    injector = new Injector([
        MysqlDatabase
    ]);

    database = injector.get(Database);

    setDal = injector.get(SetDal);

    promise = setDal.findOneUndownloaded();

    promise.then(function (set) {
        console.log(set);
    }, function (err) {
        console.log('err', err);
    });

    promise.then(function () {
        console.log('ok');
        database.end();
    }, function (err) {
        console.log(err);
    });
}

main();
