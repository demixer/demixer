import {Database} from '../database/database';
import {Inject} from 'di';

@Inject(Database)
export class SetDal {
    constructor (database) {
        this.database = database;
    }

    findOneUndownloaded () {
        return new Promise(function (resolve, reject) {
            this.database.query('SELECT url FROM `set` WHERE is_downloaded = ?', [0], function (err, results) {
                if (err) {
                    reject(err);
                }
                resolve(results[0]);
            });
        }.bind(this));
    }
}
