import { env } from '$env/dynamic/private';
import { ensureUsersTable, sql } from '$lib/db';
import { hashPassword } from '$lib/hash-password';
import { invalid, redirect } from '@sveltejs/kit';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString() ?? '';

		if (!email) return invalid(400, { email, missing: true });

		// Ensure users table exists
		await ensureUsersTable();

		const queryResults = await sql<
			{ id: number; username: string; email: string; password: string }[]
		>`
			select * from users where email = ${email} LIMIT 1
		`;

		if (queryResults.count === 0) {
			return invalid(400, { email, missingFromDB: true });
		}

		const { password: _, ...user } = queryResults[0];

		// Compare password
		const passwordsMatch = await compare(password, queryResults[0].password);

		if (!passwordsMatch) {
			return invalid(400, { email, incorrect: true });
		}

		const token = jwt.sign(user, env.JWT_KEY, { algorithm: 'HS256' });

		cookies.set('sessionID', token, {
			maxAge: 60 * 60 * 24 * 30,
		});

		throw redirect(303, '/');
	},
};
