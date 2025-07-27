import { NextRequest } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
	try {
		const { id } = await req.json();

		if (!id) {
			return new Response('ID no proporcionado', { status: 400 });
		}

		// Verificamos el token enviado en el header Authorization
		const authHeader = req.headers.get('Authorization');
		const token = authHeader?.split('Bearer ')[1];

		if (!token) {
			return new Response('Token no proporcionado', { status: 401 });
		}

		await auth.verifyIdToken(token);

		// Eliminar el documento con Admin SDK
		await db.collection('games').doc(id).delete();

		return Response.json({ message: 'Documento eliminado' });
	} catch (error) {
		console.error('Error al eliminar documento:', error);
		return new Response('Error al eliminar', { status: 500 });
	}
}
