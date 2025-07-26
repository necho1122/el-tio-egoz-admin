'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function AddGame() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<string[]>([]);
	const [status, setStatus] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newGame = {
			title,
			description,
			images,
			date: new Date().toISOString(),
			likes: 0,
		};

		try {
			const response = await fetch('/api/game/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newGame),
			});

			if (response.ok) {
				setStatus('Juego agregado correctamente');
				setTitle('');
				setDescription('');
				setImages([]);
			} else {
				setStatus('Error al agregar el juego');
			}
		} catch (error) {
			console.error('Error:', error);
			setStatus('Error al enviar el formulario');
		}
	};

	return (
		<div className='p-4 bg-card-bg rounded shadow-md mx-auto max-w-7xl'>
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
				<input
					type='text'
					placeholder='Descripción'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className='border p-2 rounded'
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
				<button
					type='submit'
					className='bg-btn  text-white py-2 px-4 rounded hover:bg-btn-hover hover:cursor-pointer'
				>
					Agregar juego
				</button>
			</form>
			{status && <p className='mt-2 text-sm text-gray-700'>{status}</p>}
		</div>
	);
}

export default AddGame;
