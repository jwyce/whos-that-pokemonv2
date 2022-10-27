// src/server/router/index.ts
import { t } from '../trpc';

import { exampleRouter } from './example';
import { pokemonRouter } from './pokemon';

export const appRouter = t.router({
	example: exampleRouter,
	pokemon: pokemonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
