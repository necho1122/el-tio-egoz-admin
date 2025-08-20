'use client';
import { useState, useEffect } from 'react';
function GamesCounter() {
	const [gamesCount, setGamesCount] = useState([]);

	useEffect(() => {
		const fetchGamesCount = async () => {
			const res = await fetch('/api/game/get');
			const data = await res.json();
			setGamesCount(data);
		};

		fetchGamesCount();
	}, []);

	return (
		<div>
			<p>
				Total Games: <span className='font-semibold'>{gamesCount.length}</span>
			</p>
		</div>
	);
}

export default GamesCounter;
