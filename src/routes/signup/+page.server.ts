import { ensureUsersTable, sql } from '$lib/db';
import { hashPassword } from '$lib/hash-password';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const username = data.get('username')?.toString();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString() ?? '';

		if (!username) return invalid(400, { username, missingUsername: true });
		if (!email) return invalid(400, { email, missingEmail: true });
		if (!password) return invalid(400, { missingPassword: true });

		const hashedPassword = await hashPassword(password);

		// Ensure users table exists
		await ensureUsersTable();

		// Now register the user
		const queryResults = await sql<
			{
				id: number;
				username: string;
				password: string;
				email: string;
			}[]
		>`
			insert into users ${sql({ username, email, password: hashedPassword })} returning *
		`;

		if (queryResults.count !== 0) {
			throw redirect(303, '/login');
		}
	},
};
