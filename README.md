# Create MySQL Database

1. Create database named snackerjack
    $ mysql -u root -e 'CREATE DATABASE snackerjack;'
1. Create column named urls. Create column to hold our posted ids
    $ mysql -u root snackerjack -e 'CREATE TABLE urls (id VARCHAR(250) NOT NULL);'
1. Create column named is_downloaded.
    $ mysql -u root snackerjack -e 'ALTER TABLE urls ADD COLUMN is_downloaded BIT(1) NOT NULL DEFAULT 0;
1. Create an index to guarantee uniqueness of the `id` column
    $ mysql -u root snackerjack -e 'CREATE UNIQUE INDEX id_idx on urls (id);'

# Download and Install

1. Download repository
1. CD to repository
    $ npm install

# Execute

1. CD to lib folder
    $ node sj-post-mysql
1. Open another terminal/cmd-line window
    $ curl -w "\n" -X POST -d 'jajaj' http://localhost:8080/my_post

This will create a new `id` entry in our mySQL Snackerjack database. If you post again with the same id, you should get `soundcloud set already stored in database`. If you post with a new id, you should get `new soundcloud set stored in database`.

I put my questions and comments in google document, [Here](https://docs.google.com/document/d/1FNd47uc3m51GhhGFNgVBMnQJNVB9psmx_CYko5iOfWs/edit?usp=sharing )

# Create necessary tables in Snackjack database

1.create table sets(id mediumint not null auto_increment, url varchar(250) not null, is_downloaded bit(1) not null
    default 0, duration mediumint unsigned, primary key(id));

1.create unique index url_idx on sets(url);

1.create table tracks(id mediumint not null auto_increment, name varchar(250) not null, primary key(id));

1.create table set_tracks(set_id mediumint not null, track_id mediumint not null, start_time mediumint not null, foreign key(track_id) references tracks(id), foreign key(set_id) references sets(id));


WHY WON'T THE README GET STAGED DAMMIT




