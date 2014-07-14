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

1.create table sets(id mediumint not null auto_increment, url varchar(250) not null, is_downloaded bit(1) not null default 0, is_split bit(1) not null default 0, duration mediumint unsigned, primary key(id));

1. create unique index url_idx on sets (url);

1. create table tracks (id mediumint not null auto_increment, artist varchar(250) not null, name varchar(250) not null, primary key (id));

1. create table set_tracks (set_id mediumint not null, track_id mediumint not null, start_time mediumint not null, foreign key (set_id) references sets(id), foreign key(track_id) references tracks(id));

# A model for ingesting tracks with echoprint-server

Correct/most sensible process for ingesting tracks to echoprint-server:

1. 

cd to echoprint-codegen

$ find ./ingest-techno -name "128295_Io_Original_Mix.mp3" > music_to_ingest

1.

$ ./echoprint-codegen -s < music_to_ingest > kk.json

cd to ~/dev/echoprint-server/util	

1.

$ python fastingest.py ~/dev/echoprint/echoprint-codegen/kk.json

Should see an output like this:

1/1 /Users/samenglander/dev/echoprint/echoprint-codegen/kk.json

-- ORRRR --

if this doesn't work - it didn't - try:

taking the code and curl posting it (load up in a .sh files as seen in the examples folder: /ingest-strategies/)

Two examples one for ingesting the track (ingest.sh), and the other for testing if the ingest went through (query.sh)

When POSTING(?) with curl (or $ sh ingest.sh) with curl, if it succeeds, the response should be something like:

{"status": "ok", "track_id": "mattjohnbobbit"}

Interesting READ

https://groups.google.com/forum/#!searchin/echoprint/no$20results$20found$20(type$207)|sort:relevance/echoprint/3ElKlD1_dMk/Ssvzf-5sfXMJ

https://groups.google.com/forum/#!searchin/echoprint/no$20results$20found$20(type$207)|sort:relevance/echoprint/O_py8fD-MXU/vQyWYeWoMfgJ

https://groups.google.com/forum/#!searchin/echoprint/identify/echoprint/1LfSWg0JBYw/PzPCy3qN6moJ

https://groups.google.com/forum/#!searchin/echoprint/ingest$20khz/echoprint/6nb6oCY8Jy0/0E6c6RXOHAIJ

https://groups.google.com/forum/#!searchin/echoprint/mp3$20codec/echoprint/hgdG0Z1z6MU/vfUo0CfZ5eoJ

and look into "best_match_for_query"
