var fs = require('fs');
var config = require('./config');
var db_url = `${config.db_user}:${config.db_password}@${config.db_ip}:${config.db_port}/${config.db_name}`;
var collections = ['reviews', 'words'];
var mongojs = require('mongojs');
var db = mongojs(db_url, collections);

exports.db = db;
