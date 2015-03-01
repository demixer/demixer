dbm = dbm || require('db-migrate');

var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('set', {
        'id': {
            autoIncrement: true,
            primaryKey: true,
            notNull: true,
            type: type.INTEGER,
            unsigned: true
        },
        'url': {
            length: 255,
            notNull: true,
            type: type.STRING,
            unique: true
        },
        'is_downloaded': {
            defaultValue: false,
            notNull: true,
            type: type.BOOLEAN
        },
        'is_split': {
            defaultValue: false,
            notNull: true,
            type: type.BOOLEAN
        },
        'duration': {
            notNull: true,
            type: type.INTEGER,
            unsigned: true
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('set', callback);
};
