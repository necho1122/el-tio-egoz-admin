import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: Request) {
	const body = await request.json();

	const {
		title,
		description,
		images,
		basicInfomation,
		details,
		platforms,
		downloadLink,
	} = body;

	// Validaciones
	if (
		!title ||
		!description ||
		!Array.isArray(images) ||
		!Array.isArray(basicInfomation) ||
		!Array.isArray(details) ||
		!Array.isArray(platforms) ||
		!Array.isArray(downloadLink)
	) {
		return new Response('Datos inválidos', { status: 400 });
	}

	// Creación del documento
	await addDoc(collection(db, 'games'), {
		title,
		description,
		images,
		basicInfomation,
		details,
		platforms,
		downloadLink,
		createdAt: Timestamp.now(),
		likes: 0,
	});

	return Response.json({ message: 'Item agregado correctamente' });
}
