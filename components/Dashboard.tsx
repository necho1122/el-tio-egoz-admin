'use client';

import { useEffect, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import GamesCounter from './GamesCounter';

type Item = {
	id: string;
	title: string;
	description: string;
	images: string[];
	createdAt: number;
	likes: number;
	basicInformation?: string[];
	details?: string[];
	platforms?: string[];
	linkAndroid?: string;
	linkWindows?: string;
	linkMac?: string;
	linkIos?: string;
	createdBy?: string;
};

export default function ItemsList() {
	const [data, setData] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [currentGame, setCurrentGame] = useState<Item | null>(null);
	const [formTitle, setFormTitle] = useState('');
	const [formDescription, setFormDescription] = useState('');
	const [formImages, setFormImages] = useState<string>('');
	const [basicInformation, setbasicInformation] = useState<string>('');
	const [details, setDetails] = useState<string>('');
	const [platforms, setPlatforms] = useState<string>('');
	const [linkAndroid, setLinkAndroid] = useState<string>('');
	const [linkWindows, setLinkWindows] = useState<string>('');
	const [linkMac, setLinkMac] = useState<string>('');
	const [linkIos, setLinkIos] = useState<string>('');
	const [search, setSearch] = useState(''); // Estado para la búsqueda

	useEffect(() => {
		async function fetchItems() {
			try {
				const res = await fetch('/api/game/get');
				const items = await res.json();
				setData(items);
			} catch (err) {
				console.error('Error al obtener los items:', err);
			} finally {
				setLoading(false);
			}
		}
		fetchItems();
	}, []);

	const deleteItem = async (id: string) => {
		const confirmed = window.confirm(
			'¿Estás seguro de que deseas eliminar este juego?'
		);

		if (!confirmed) return;

		try {
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				alert('No estás autenticado');
				return;
			}

			const token = await user.getIdToken();

			const res = await fetch('/api/game/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id }),
			});

			if (res.ok) {
				setData((prev) => prev.filter((game) => game.id !== id));
				alert('Juego eliminado correctamente');
			} else {
				alert('No se pudo eliminar el juego');
			}
		} catch (error) {
			console.error('Error al eliminar:', error);
			alert('Ocurrió un error al intentar eliminar el juego');
		}
	};

	const openEditModal = (item: Item) => {
		setCurrentGame(item);
		setFormTitle(item.title);
		setFormDescription(item.description);
		setFormImages(item.images?.join('\n') || '');
		setbasicInformation(item.basicInformation?.join('\n') || '');
		setDetails(item.details?.join('\n') || '');
		setPlatforms(item.platforms?.join('\n') || '');
		setLinkAndroid(item.linkAndroid || '');
		setLinkWindows(item.linkWindows || '');
		setLinkMac(item.linkMac || '');
		setLinkIos(item.linkIos || '');
		setEditModalOpen(true);
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!currentGame) return;

		const updatedData = {
			title: formTitle,
			description: formDescription,
			images: formImages
				.split('\n')
				.map((url) => url.trim())
				.filter((url) => url.length > 0),
			basicInformation: basicInformation
				.split('\n')
				.map((x) => x.trim())
				.filter((x) => x),
			details: details
				.split('\n')
				.map((x) => x.trim())
				.filter((x) => x),
			platforms: platforms
				.split('\n')
				.map((x) => x.trim())
				.filter((x) => x),
			linkAndroid: linkAndroid.trim(),
			linkWindows: linkWindows.trim(),
			linkMac: linkMac.trim(),
			linkIos: linkIos.trim(),
			createdBy: currentGame.createdBy, // Mantener el creador original
		};

		const auth = getAuth();
		const user = auth.currentUser;

		if (!user) {
			alert('No estás autenticado');
			return;
		}

		const token = await user.getIdToken();

		const res = await fetch('/api/game/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				id: currentGame.id,
				data: updatedData,
			}),
		});

		if (res.ok) {
			setData((prev) =>
				prev.map((item) =>
					item.id === currentGame.id ? { ...item, ...updatedData } : item
				)
			);
			setEditModalOpen(false);
			setCurrentGame(null);
		} else {
			alert('No se pudo actualizar el juego');
		}
	};

	// Filtrar juegos por título según búsqueda
	const filteredData = data.filter((item) =>
		item.title.toLowerCase().includes(search.toLowerCase())
	);

	if (loading) return <p className='mx-auto text-center'>Cargando...</p>;

	return (
		<div className='max-w-7xl mx-auto px-4 py-8'>
			<div className='w-full flex justify-between items-center mb-6 gap-4'>
				<div className='flex max-w-7xl items-center justify-center gap-4 pt-4'>
					<Image
						src='/logo.webp'
						alt='El tío Egoz - Admin'
						width={60}
						height={60}
						className='rounded-full'
					/>
					<h1 className='text-heading text-2xl font-bold'>
						El tío Egoz - Admin
					</h1>
				</div>
				{/* Barra de búsqueda */}
				<div className='w-full max-w-md md:max-w-sm'>
					<input
						type='text'
						placeholder='🔍 Buscar juegos por título...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='w-full px-4 py-2 rounded-lg border-2 border-[#7f5af0] focus:outline-none focus:ring-2 focus:ring-[#7f5af0] bg-[#16161a] text-[#fffffe] placeholder-[#a7a9be] shadow-md transition-all duration-200'
						style={{
							fontFamily: 'monospace',
							fontWeight: 500,
							letterSpacing: '0.03em',
							boxShadow: '0 2px 12px 0 rgba(127,90,240,0.08)',
						}}
					/>
				</div>
				<GamesCounter />
				<button
					onClick={() => signOut(auth)}
					className='flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md mb-4 flex-nowrap text-nowrap'
				>
					<Image
						src='/icons/exit.png'
						alt='Cerrar sesión'
						width={16}
						height={16}
					/>
					Cerrar sesión
				</button>
			</div>
			<div className='grid sm:grid-cols-2 md:grid-cols-3 gap-8'>
				<Link
					href='/addGame'
					className='flex flex-col items-center justify-center fixed bottom-4 right-4 hover:bg-card-bg p-2 rounded-md z-50'
				>
					<span className='text-heading text-3xl'>+</span>
					<span className='text-heading text-xs'>Agregar Juego</span>
				</Link>

				{filteredData.map((item) => (
					<div
						key={item.id}
						className='mb-10 pb-6 bg-card-bg rounded-lg flex flex-col justify-between shadow-lg hover:shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-105'
					>
						<h2 className='text-xl text-heading font-semibold p-4'>
							{item.title}
						</h2>
						<ImageSlider images={item.images} />
						<p className='text-text-secondary px-2 line-clamp-3'>
							{item.description}
						</p>
						<p className='text-sm text-gray-500 px-2 pt-1'>
							Likes: {item.likes}
						</p>
						<p className='text-sm text-gray-500 p-2'>
							Fecha: {new Date(item.createdAt).toLocaleDateString()}
						</p>
						<div className='flex justify-between px-8 md:px-4 gap-2'>
							<button
								className='bg-btn hover:bg-btn-hover hover:cursor-pointer px-4 py-1 rounded-sm flex gap-2 items-center justify-center'
								onClick={() => openEditModal(item)}
							>
								<Image
									src='/icons/edit.svg'
									alt='Editar'
									width={16}
									height={16}
								/>
								Editar
							</button>
							<button
								className='bg-red-500 hover:bg-red-400 hover:cursor-pointer px-2 py-1 rounded-sm flex gap-2 items-center justify-center'
								onClick={() => deleteItem(item.id)}
							>
								<Image
									src='/icons/bin.svg'
									alt='Eliminar'
									width={16}
									height={16}
								/>
								Eliminar
							</button>
						</div>
					</div>
				))}
			</div>
			{editModalOpen && currentGame && (
				<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
					<div className='bg-card-bg p-6 rounded-md w-full max-w-xl relative shadow-lg'>
						<button
							className='absolute top-2 right-2 text-black font-bold hover:cursor-pointer hover:scale-105'
							onClick={() => setEditModalOpen(false)}
						>
							X
						</button>
						<h2 className='text-lg font-semibold mb-4'>Editar juego</h2>
						<form
							onSubmit={handleUpdate}
							className='flex flex-col gap-4'
						>
							<input
								type='text'
								value={formTitle}
								onChange={(e) => setFormTitle(e.target.value)}
								className='border p-2 rounded'
								required
							/>
							<input
								type='text'
								value={formDescription}
								onChange={(e) => setFormDescription(e.target.value)}
								className='border p-2 rounded'
								required
							/>
							<textarea
								value={formImages}
								onChange={(e) => setFormImages(e.target.value)}
								className='border p-2 rounded'
								rows={5}
								required
							/>
							<textarea
								placeholder='Información básica del juego (una por línea)'
								value={basicInformation}
								onChange={(e) => setbasicInformation(e.target.value)}
								className='border p-2 rounded'
								rows={3}
								required
							/>
							<textarea
								placeholder='Detalles del juego (una por línea)'
								value={details}
								onChange={(e) => setDetails(e.target.value)}
								className='border p-2 rounded'
								rows={3}
								required
							/>
							<textarea
								placeholder='Plataformas (una por línea)'
								value={platforms}
								onChange={(e) => setPlatforms(e.target.value)}
								className='border p-2 rounded'
								rows={3}
								required
							/>
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
								Guardar cambios
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

function ImageSlider({ images }: { images: string[] }) {
	const [sliderRef] = useKeenSlider<HTMLDivElement>({
		loop: true,
		mode: 'snap',
		slides: {
			perView: 1,
			spacing: 10,
		},
	});

	return (
		<div
			ref={sliderRef}
			className='keen-slider rounded overflow-hidden'
		>
			{images.map((url, idx) => (
				<div
					className='keen-slider__slide'
					key={idx}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={url}
						alt={`Imagen ${idx + 1}`}
						className='w-full h-64 object-cover'
					/>
				</div>
			))}
		</div>
	);
}
