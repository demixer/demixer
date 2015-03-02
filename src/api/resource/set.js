import {Database} from '../../database/database';
import {Inject} from 'di';

@Inject(Database)
export class Set {
    constructor (database) {
        this.database = database;
    }

    post (req, res, next) {
        var alreadyExists,
            select,
            url;

        alreadyExists = false;
        url = req.params.url;
        select = this.database.query('SELECT * from `set` WHERE url=(?) LIMIT 1', url);
        select.on('result', function (result) {
            alreadyExists = true;
        });
        select.on('end', () => {
            var insert;
            if (alreadyExists) {
                res.send(409);
            } else {
                insert = this.database.query('INSERT INTO `set` (url) VALUES (?)', url, function (err, result) {
                    if (err) {
                        res.send(500);
                    } else {
                        res.send(200);
                    }
                });
            }
        });
    }
}
