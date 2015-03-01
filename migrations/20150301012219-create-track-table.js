dbm = dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('track', {
        'id': {
            autoIncrement: true,
            notNull: true, 
            primaryKey: true,
            type: type.INTEGER,
            unsigned: true
        },
        'artist_id': {
            foreignKey: {
                mapping: 'id',
                name: 'track_artist_id_fk',
                rules: {},
                table: 'artist'
            },
            notNull: true,
            type: type.INTEGER,
            unsigned: true
        },
        'name': {
            length: 255,
            notNull: true,
            type: type.STRING,
            unique: true
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('track', callback);
};
