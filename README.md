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
