'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			// Si está en login y ya está autenticado, redirige a / (home)
			if (pathname === '/login' && user) {
				router.replace('/');
			}
			// Si no está autenticado y NO está en /login, redirige a /login
			else if (!user && pathname !== '/login') {
				router.replace('/login');
			}
			// Todo bien, muestra la ruta
			else {
				setLoading(false);
			}
		});

		return () => unsubscribe();
	}, [pathname, router]);

	if (loading) {
		return <LoadingSpinner />; // opcional: puedes retornar null también
	}

	return <>{children}</>;
}
