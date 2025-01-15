const NeDB = require('nedb');
const db = new NeDB({ filename: 'server/database/users.db', autoload: true });

db.find({}, (err, docs) => {
    if (err) {
        console.error('Error reading database:', err);
    } else {
        console.log('Users in database:', docs);
    }
});
