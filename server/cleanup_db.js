const NeDB = require('nedb');
const db = new NeDB({ filename: 'server/database/users.db', autoload: true });

db.remove({}, { multi: true }, (err, numRemoved) => {
    if (err) {
        console.error('Error cleaning up database:', err);
    } else {
        console.log(`Removed ${numRemoved} entries from the database.`);
    }
});
