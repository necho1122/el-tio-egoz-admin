import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
	try {
		const querySnapshot = await getDocs(collection(db, 'games'));

		const items = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			createdAt: doc.data().createdAt?.toDate?.() ?? new Date(0), // convertir Timestamp a Date
		}));

		return Response.json(items);
	} catch (error) {
		console.error('Error al obtener los items:', error);
		return new Response('Error al obtener los datos', { status: 500 });
	}
}
