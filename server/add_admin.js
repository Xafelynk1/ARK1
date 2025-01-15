const NeDB = require('nedb');
const db = new NeDB({ filename: 'server/database/users.db', autoload: true });

const adminUser = {
    username: 'adminUser',
    password: 'adminPassword', // Use a hashed password in production
};

db.insert(adminUser, (err, newDoc) => {
    if (err) {
        console.error('Error adding admin user:', err);
    } else {
        console.log('Admin user added:', newDoc);
    }
});
