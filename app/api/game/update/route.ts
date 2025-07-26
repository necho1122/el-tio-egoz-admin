import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
	const { id, data } = await req.json();

	if (!id || !data) {
		return new Response('ID o datos faltantes', { status: 400 });
	}

	try {
		await updateDoc(doc(db, 'games', id), data);
		return Response.json({ message: 'Documento actualizado' });
	} catch (error) {
		console.error('Error al actualizar documento:', error);
		return new Response('Error al actualizar', { status: 500 });
	}
}
