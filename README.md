# Create mySQL Database:

1. Create database named snackerjack

        $ mysql -u root -e 'CREATE DATABASE snackerjack'

2. Create table named urls. Create column to hold our posted ids

        $ mysql -u root snackerjack -e 'CREATE TABLE urls (id VARCHAR(50) NOT NULL)'

# Download and Install:

1. Download repository

2. CD to repository

        $ npm install

# Execute:

1. CD to lib folder

        $ node sj-post-mysql

2. Open another terminal/cmd-line window

        $ curl -X POST -d 'jajaj' http://localhost:8080/my_post

This will create a new `id` entry in our mySQL Snackerjack database. If you post again with the same id, you should get `soundcloud set already stored in database`. If you post with a new id, you should get `new soundcloud set stored in database`.

I put my questions and comments in google document, [Here](https://docs.google.com/document/d/1FNd47uc3m51GhhGFNgVBMnQJNVB9psmx_CYko5iOfWs/edit?usp=sharing )