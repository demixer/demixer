import {Database} from './database'
import mysql from 'mysql';
import {Provide} from 'di';

@Provide(Database)
export class MysqlDatabase {
    constructor () {
        this.connection = mysql.createPool({
            connectionLimit: 10,
            database: 'demixer',
            host: 'localhost',
            user: 'root',
        });
    }

    query (...args) {
        return this.connection.query(...args);
    }
}
