# demixer

## Requirements

1. mysql
1. nodejs

## Setup

### Install node nodules

    ~/dev/demixer $ npm install

### Create demixer database

    ~/dev/demixer $ mysql -u root -e 'create database demixer;'

### Run migrations

    ~/dev/demixer $ node_modules/db-migrate/bin/db-migrate up

## Build

    ~/dev/demixer $ gulp build

## Run

### Start API server

    ~/dev/demixer $ node build/api/main.js

### Example API requests

    ~/dev/demixer $ curl -X POST \
                         -d '{"url":"http://soundcloud.com/123/derek-plaslaiko"}' \
                         -H 'Content-Type:application/json' \
                         localhost:6060/set
