import {Database} from '../../database/database';
import {Inject} from 'di';

@Inject(Database)
export class SetResource {
    constructor (database) {
        this.database = database;
    }

    post (req, res, next) {
        var alreadyExists,
            select,
            url;

        console.log('in post');

        alreadyExists = false;
        url = req.params.url;
        console.log(req.params);

        console.log('in post; selecting');
        select = this.database.query('SELECT * from `set` WHERE url=(?) LIMIT 1', url);

        select.on('result', function (result) {
            console.log('in post; already exists');
            alreadyExists = true;
        });

        select.on('end', () => {
            var insert;
            console.log('in post; end select');
            if (alreadyExists) {
                res.send(409);
            } else {
                console.log('in post; inserting');
                insert = this.database.query('INSERT INTO `set` SET ?', {url: url}, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(500);
                    } else {
                        res.send(200);
                    }
                });
            }
        });
    }
}
