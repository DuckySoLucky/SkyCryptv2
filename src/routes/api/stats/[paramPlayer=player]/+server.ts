import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fetchPlayer, getProfile } from '$lib/lib';
import { getStats } from '$lib/stats';

export const GET: RequestHandler = async ({ params }) => {
	const timeNow = Date.now();
	const { paramPlayer } = params;

	const [profile, player] = await Promise.all([getProfile(paramPlayer, null), fetchPlayer(paramPlayer)]);

	const stats = await getStats(profile, player);

	console.log(`/api/stats/${paramPlayer} took ${Date.now() - timeNow}ms`);
	return json(stats);
};
