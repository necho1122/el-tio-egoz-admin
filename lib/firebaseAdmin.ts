// lib/firebaseAdmin.ts
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

if (!getApps().length) {
	app = initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		}),
	});
} else {
	app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
