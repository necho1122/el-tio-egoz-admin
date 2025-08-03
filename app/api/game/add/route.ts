// app/api/game/add/route.ts
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const authHeader = req.headers.get('Authorization');
		if (!authHeader?.startsWith('Bearer ')) {
			return new NextResponse('No autorizado', { status: 401 });
		}

		const token = authHeader.split(' ')[1];
		const decoded = await auth.verifyIdToken(token);

		const body = await req.json();

		if (
			typeof body.title !== 'string' ||
			typeof body.description !== 'string' ||
			!Array.isArray(body.images) ||
			!Array.isArray(body.basicInformation) ||
			!Array.isArray(body.details) ||
			!Array.isArray(body.platforms)
		) {
			return new NextResponse('Datos inválidos', { status: 400 });
		}

		const newGame = {
			title: body.title,
			description: body.description,
			images: body.images,
			basicInformation: body.basicInformation,
			details: body.details,
			platforms: body.platforms,
			linkAndroid: body.linkAndroid || '',
			linkWindows: body.linkWindows || '',
			linkMac: body.linkMac || '',
			linkIos: body.linkIos || '',
			createdAt: FieldValue.serverTimestamp(),
			likes: 0,
			createdBy: decoded.uid,
		};

		const docRef = await db.collection('games').add(newGame);

		return NextResponse.json({
			message: 'Juego agregado correctamente',
			id: docRef.id,
		});
	} catch (error) {
		console.error('Error en el endpoint addGame:', error);
		return new NextResponse('Error interno del servidor', { status: 500 });
	}
}
