const admin = require('firebase-admin');

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    async register() {
        const userRecord = await admin.auth().createUser({
            email: this.email,
            password: this.password,
        });
        return userRecord;
    }

    async login() {
        // Implement login logic here
    }
}

module.exports = User;
