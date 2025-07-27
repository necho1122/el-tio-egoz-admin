// app/api/game/add/route.ts
import { auth, db } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new NextResponse('No autorizado', { status: 401 });
		}

		const token = authHeader.split(' ')[1];

		// Verifica el token del usuario
		const decoded = await auth.verifyIdToken(token);
		if (!decoded) {
			return new NextResponse('Token inválido', { status: 401 });
		}

		const body = await req.json();
		const {
			title,
			description,
			images,
			basicInfomation,
			details,
			platforms,
			downloadLink,
		} = body;

		// Validación de datos
		if (
			!title ||
			!description ||
			!Array.isArray(images) ||
			!Array.isArray(basicInfomation) ||
			!Array.isArray(details) ||
			!Array.isArray(platforms) ||
			!Array.isArray(downloadLink)
		) {
			return new NextResponse('Datos inválidos', { status: 400 });
		}

		// Agregar el documento usando Admin SDK
		await db.collection('games').add({
			title,
			description,
			images,
			basicInfomation,
			details,
			platforms,
			downloadLink,
			createdAt: new Date(),
			likes: 0,
			createdBy: decoded.uid, // usuario autenticado
		});

		return NextResponse.json({ message: 'Juego agregado correctamente' });
	} catch (error) {
		console.error('Error en el endpoint addGame:', error);
		return new NextResponse('Error interno del servidor', { status: 500 });
	}
}
