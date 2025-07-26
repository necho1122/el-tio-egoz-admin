import { db } from '@/lib/firebase'
import { doc, deleteDoc } from 'firebase/firestore'

export async function POST(req: Request) {
  const { id } = await req.json()

  if (!id) {
    return new Response('ID no proporcionado', { status: 400 })
  }

  try {
    await deleteDoc(doc(db, 'games', id))
    return Response.json({ message: 'Documento eliminado' })
  } catch {
    return new Response('Error al eliminar', { status: 500 })
  }
}
