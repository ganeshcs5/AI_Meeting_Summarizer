const admin = require('firebase-admin');

class FirebaseService {
    constructor() {
        this.isEnabled = process.env.ENABLE_FIREBASE === 'true';
        if (this.isEnabled) {
            this.db = admin.firestore();
        }
    }

    async saveAnalysis(data) {
        if (!this.isEnabled) {
            return null; // Skip saving if Firebase is disabled
        }

        try {
            const docRef = await this.db.collection('analyses').add({
                ...data,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            throw new Error('Failed to save analysis');
        }
    }

    async getAnalysis(id) {
        if (!this.isEnabled) {
            throw new Error('Firebase storage is disabled');
        }

        try {
            const doc = await this.db.collection('analyses').doc(id).get();
            if (!doc.exists) {
                throw new Error('Analysis not found');
            }
            return doc.data();
        } catch (error) {
            console.error('Error retrieving from Firebase:', error);
            throw new Error('Failed to retrieve analysis');
        }
    }

    async listAnalyses(limit = 10) {
        if (!this.isEnabled) {
            throw new Error('Firebase storage is disabled');
        }

        try {
            const snapshot = await this.db.collection('analyses')
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error listing analyses:', error);
            throw new Error('Failed to list analyses');
        }
    }
}

module.exports = new FirebaseService(); 