dbm = dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('set_track', {
        'set_id': {
            foreignKey: {
                mapping: 'id',
                name: 'set_track_set_id_fk',
                rules: {},
                table: 'set'
            },
            notNull: true,
            type: type.INTEGER,
            unsigned: true
        },
        'track_id': {
            foreignKey: {
                mapping: 'id',
                name: 'set_track_track_id_fk',
                rules: {},
                table: 'track'
            },
            notNull: true,
            type: type.INTEGER,
            unsigned: true
        },
        'offset': {
            notNull: true,
            type: type.INTEGER
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('set_track', callback);
};
