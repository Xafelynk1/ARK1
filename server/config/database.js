const Datastore = require('nedb');
const path = require('path');

// Initialize the NeDB database for users
const usersDB = new Datastore({
    filename: path.join(__dirname, '../database/users.db'),
    autoload: true
});

module.exports = usersDB;
