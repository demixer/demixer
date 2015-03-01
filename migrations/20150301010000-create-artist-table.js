dbm = dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('artist', {
        'id': {
            autoIncrement: true,
            notNull: true,
            primaryKey: true,
            type: type.INTEGER,
            unsigned: true
        },
        'name': {
            length: 255,
            notNull: true,
            type: type.STRING,
            unique: true,
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('artist', callback);
};
