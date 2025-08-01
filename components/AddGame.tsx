'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { auth } from '@/lib/firebase';

function AddGame() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<string[]>([]);
	const [basicInformation, setbasicInformation] = useState<string[]>([]);
	const [details, setDetails] = useState<string[]>([]);
	const [platforms, setPlatforms] = useState<string[]>([]);
	const [linkAndroid, setLinkAndroid] = useState<string>('');
	const [linkWindows, setLinkWindows] = useState<string>('');
	const [linkMac, setLinkMac] = useState<string>('');
	const [linkIos, setLinkIos] = useState<string>('');
	const [status, setStatus] = useState('');
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		if (status) {
			const timeout = setTimeout(() => {
				setStatus('');
				setIsSuccess(null);
			}, 3000);

			return () => clearTimeout(timeout);
		}
	}, [status]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const user = auth.currentUser;

		if (!user) {
			setStatus('Debes iniciar sesión para agregar un juego');
			setIsSuccess(false);
			return;
		}

		try {
			const idToken = await user.getIdToken();

			const newGame = {
				title,
				description,
				images,
				basicInformation,
				details,
				platforms,
				linkAndroid,
				linkWindows,
				linkMac,
				date: new Date().toISOString(),
				likes: 0,
			};

			const response = await fetch('/api/game/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`,
				},
				body: JSON.stringify(newGame),
			});

			if (response.ok) {
				setStatus('Juego agregado correctamente');
				setIsSuccess(true);

				// Limpiar campos
				setTitle('');
				setDescription('');
				setImages([]);
				setbasicInformation([]);
				setDetails([]);
				setPlatforms([]);
				setLinkAndroid('');
				setLinkWindows('');
				setLinkMac('');
				setLinkIos('');
			} else {
				const errorText = await response.text();
				setStatus(`Error al agregar el juego: ${errorText}`);
				setIsSuccess(false);
			}
		} catch (error) {
			console.error('Error:', error);
			setStatus('Error al enviar el formulario');
			setIsSuccess(false);
		}
	};

	return (
		<div className='p-4 bg-card-bg rounded shadow-md mx-auto max-w-7xl relative'>
			<Link
				href='/'
				className='flex flex-col items-center justify-center gap-1 fixed top-4 right-4 hover:bg-card-bg p-2 rounded-md z-50'
			>
				<Image
					src='/icons/home.svg'
					alt='Home icon'
					width={24}
					height={24}
				/>
				<span className='text-heading text-xs'>Home</span>
			</Link>

			<h2 className='text-xl font-bold mb-4'>Agregar datos de juego</h2>

			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-4'
			>
				<input
					type='text'
					placeholder='Título del juego'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className='border p-2 rounded'
					required
				/>
				<textarea
					placeholder='Descripción'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className='border p-2 rounded'
					rows={7}
					required
				/>
				<textarea
					placeholder='Pega una URL por línea'
					onChange={(e) => {
						const urls = e.target.value
							.split('\n')
							.map((url) => url.trim())
							.filter((url) => url.length > 0);
						setImages(urls);
					}}
					className='border p-2 rounded'
					rows={5}
					required
				></textarea>
				<textarea
					placeholder='Información básica del juego (una por línea)'
					onChange={(e) => {
						const info = e.target.value
							.split('\n')
							.map((line) => line.trim())
							.filter((line) => line.length > 0);
						setbasicInformation(info);
					}}
					className='border p-2 rounded'
					rows={3}
				></textarea>
				<textarea
					placeholder='Detalles del juego (una por línea)'
					onChange={(e) => {
						const details = e.target.value
							.split('\n')
							.map((line) => line.trim())
							.filter((line) => line.length > 0);
						setDetails(details);
					}}
					className='border p-2 rounded'
					rows={3}
				></textarea>
				<textarea
					placeholder='Plataformas (una por línea)'
					onChange={(e) => {
						const platforms = e.target.value
							.split('\n')
							.map((line) => line.trim())
							.filter((line) => line.length > 0);
						setPlatforms(platforms);
					}}
					className='border p-2 rounded'
					rows={3}
				></textarea>
				<input
					type='text'
					placeholder='Enlace Android'
					value={linkAndroid}
					onChange={(e) => setLinkAndroid(e.target.value)}
					className='border p-2 rounded'
				/>
				<input
					type='text'
					placeholder='Enlace Windows'
					value={linkWindows}
					onChange={(e) => setLinkWindows(e.target.value)}
					className='border p-2 rounded'
				/>
				<input
					type='text'
					placeholder='Enlace Mac'
					value={linkMac}
					onChange={(e) => setLinkMac(e.target.value)}
					className='border p-2 rounded'
				/>
				<input
					type='text'
					placeholder='Enlace iOS'
					value={linkIos}
					onChange={(e) => setLinkIos(e.target.value)}
					className='border p-2 rounded'
				/>

				<button
					type='submit'
					className='bg-btn text-white py-2 px-4 rounded hover:bg-btn-hover hover:cursor-pointer'
				>
					Agregar juego
				</button>
			</form>

			{status && (
				<div
					className={clsx(
						'fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white text-sm z-50 transition-all duration-300',
						{
							'bg-green-600': isSuccess,
							'bg-red-500': isSuccess === false,
						}
					)}
				>
					{status}
				</div>
			)}
		</div>
	);
}

export default AddGame;
