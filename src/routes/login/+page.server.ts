import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { sql } from '$lib/db';
import { hashPassword } from '$lib/hash-password';
import { fail, redirect } from '@sveltejs/kit';
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

		if (!email) return fail(400, { email, missing: true });

		const hashedPassword = await hashPassword(password);

		const queryResults = await sql<{ id: number; username: string; email: string }[]>`
			select * from users where email = ${email} AND password = ${hashedPassword}
		`;

		if (queryResults.length === 0) {
			// No user exists
			return fail(400, { email, incorrect: true });
		}

		const user = queryResults[0];

		const token = jwt.sign(user, env.JWT_KEY, { algorithm: 'HS256' });

		cookies.set('sessionID', token, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			secure: !dev,
		});

		throw redirect(303, '/');
	},
};
