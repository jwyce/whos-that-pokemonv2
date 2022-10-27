import { z } from 'zod';

import { t } from '../trpc';

export const PokeTypes = [
	'fire',
	'water',
	'grass',
	'electric',
	'normal',
	'poison',
	'ground',
	'flying',
	'psychic',
	'bug',
	'rock',
	'ghost',
	'dragon',
	'dark',
	'steel',
	'fairy',
	'ice',
	'fighting',
] as const;

export interface IPokeApiPokemon {
	name: string;
	id: number;
	sprites: {
		front_default: string;
	};
}

interface IPokeApiAllPokemon {
	results: IPokeApiPokemon[];
}

export interface IPokemonDto {
	name: string;
	id: number;
	sprite: string;
}

export const pokemonRouter = t.router({
	all: t.procedure.query(async () => {
		const data: IPokeApiAllPokemon = await (
			await fetch('https://pokeapi.co/api/v2/pokemon/')
		).json();

		return data.results.map((pokemon) => pokemon.name);
	}),
	greeting: t.procedure.input(z.string()).query(({ input }) => {
		return { message: `Hello ${input}` };
	}),
	byId: t.procedure
		.input(z.number())
		.query(async ({ input }): Promise<IPokemonDto> => {
			const data: IPokeApiPokemon = await (
				await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
			).json();

			return {
				name: data.name,
				id: data.id,
				sprite: data.sprites.front_default,
			};
		}),
	create: t.procedure
		.input(
			z.object({
				name: z.string(),
				type: z.array(z.enum(PokeTypes)).min(1).max(2),
				id: z.number(),
			})
		)
		.mutation(({ input }) => {
			// would call a service or use prisma to push to DB
			return input;
		}),
});
