import { NextPage } from 'next';
import Image from 'next/image';
import { trpc } from '~/utils/trpc';
import { useState } from 'react';
import confetti from 'canvas-confetti';

const getRandomPokemon = () => {
	return Math.floor(Math.random() * 420) + 1;
};

const Home: NextPage = () => {
	const [index, setIndex] = useState(getRandomPokemon());
	const [guess, setGuess] = useState('');
	const [hidden, setHidden] = useState(true);
	const [numGuesses, setNumGuesses] = useState(0);

	const findPokemon = trpc.pokemon.byId.useQuery(index);

	const handleGameReset = () => {
		setHidden(true);
		setGuess('');
		setNumGuesses(0);
		setIndex(getRandomPokemon());
	};

	const handleGuess = async () => {
		if (!hidden) {
			handleGameReset();
		} else {
			if (numGuesses < 5) {
				if (guess.toLowerCase() === findPokemon.data?.name.toLowerCase()) {
					setHidden(false);
					confetti();
				}
				setGuess('');
				setNumGuesses((prev) => prev + 1);
			}
			if (numGuesses + 1 >= 5) {
				setHidden(false);
			}
		}
	};

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col items-center max-w-2xl">
				<h2 className="text-purple-400 font-bold pt-2 text-6xl">
					Who&apos;s that Pokémon?
				</h2>
				{findPokemon.data ? (
					<Image
						alt={findPokemon.data.name}
						src={findPokemon.data.sprite}
						width={400}
						height={400}
						style={{
							imageRendering: 'pixelated',
							filter: hidden ? 'contrast(0%) brightness(50%)' : 'none',
							userSelect: 'none',
						}}
						draggable={false}
					/>
				) : (
					<div style={{ minHeight: 400 }}>loading...</div>
				)}
				{!hidden && (
					<>
						<h4 className="capitalize">It&apos;s {findPokemon.data?.name}!</h4>
						<button
							onClick={handleGameReset}
							className="w-max bg-yellow-500 rounded-lg text-white font-semibold hover:bg-yellow-600 px-4 py-1 mb-2"
						>
							Go Again?
						</button>
					</>
				)}

				<input
					className="w-64 border-2 border-purple-400 rounded-md px-2 py-1 mb-2"
					placeholder="Enter pokemon name"
					value={guess}
					disabled={numGuesses >= 5}
					onChange={(e) => setGuess(e.target.value)}
					onKeyUp={(e) => {
						if (e.key === 'Enter') {
							handleGuess();
						}
					}}
				/>

				<button
					onClick={handleGuess}
					className="w-max bg-purple-500 rounded-md text-white font-semibold hover:bg-purple-600 px-4 py-1 mt-2"
					disabled={numGuesses >= 5}
				>
					Guess
				</button>
				<p className=" font-semibold mt-4" color={numGuesses >= 5 ? 'red' : ''}>
					Number of guesses: {numGuesses}
				</p>
			</div>
		</div>
	);
};

export default Home;
