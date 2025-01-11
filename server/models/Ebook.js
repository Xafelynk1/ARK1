const admin = require('firebase-admin');

class Ebook {
    constructor(title, author, description, fileUrl) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.fileUrl = fileUrl;
    }

    async upload() {
        const db = admin.firestore();
        const ebookRef = db.collection('ebooks').doc();
        const ebookData = {
            id: ebookRef.id,
            title: this.title,
            author: this.author,
            description: this.description,
            fileUrl: this.fileUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await ebookRef.set(ebookData);
    }

    static async getEbooks() {
        const db = admin.firestore();
        const snapshot = await db.collection('ebooks').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

module.exports = Ebook;
