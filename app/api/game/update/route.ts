import { NextRequest } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
	try {
		const { id, data } = await req.json();

		if (!id || !data) {
			return new Response('ID o datos faltantes', { status: 400 });
		}

		// Verificamos token del usuario
		const authHeader = req.headers.get('Authorization');
		const token = authHeader?.split('Bearer ')[1];

		if (!token) {
			return new Response('Token no proporcionado', { status: 401 });
		}

		await auth.verifyIdToken(token);

		// Actualizar documento
		await db.collection('games').doc(id).update(data);

		return Response.json({ message: 'Documento actualizado' });
	} catch (error) {
		console.error('Error al actualizar documento:', error);
		return new Response('Error al actualizar', { status: 500 });
	}
}
