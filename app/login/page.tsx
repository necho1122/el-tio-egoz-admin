// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push('/');
			}
		});
		return () => unsubscribe();
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/');
		} catch (err) {
			setError('Credenciales inválidas o error al iniciar sesión.');
		}
	};

	return (
		<div className='flex  justify-center'>
			<form
				onSubmit={handleLogin}
				className='space-y-4 bg-card-bg p-6 shadow rounded'
			>
				<h1 className='text-xl font-bold'>Iniciar sesión</h1>
				<input
					type='email'
					placeholder='Correo electrónico'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='border p-2 w-full border-gray-300 bg-transparent focus:outline-none'
				/>
				<input
					type='password'
					placeholder='Contraseña'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='border p-2 w-full'
				/>
				{error && <p className='text-red-500'>{error}</p>}
				<button
					type='submit'
					className='bg-btn hover:bg-btn-hover hover:cursor-pointer text-white px-4 py-2 rounded'
				>
					Entrar
				</button>
			</form>
		</div>
	);
}
