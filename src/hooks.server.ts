import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ resolve, event }) => {
	// set event.locals to whatever you want
	const { cookies } = event;

	const sessionID = cookies.get('sessionID');

	if (sessionID) {
		try {
			const jwtVerification = jwt.verify(sessionID, env.JWT_KEY);
			console.log(jwtVerification);
		} catch (e: any) {
			if (e.message === 'invalid signature') {
				// Log out user
				event.cookies.delete('sessionID');
				// Reload

				event.setHeaders({
					// Reload page header
					Refresh: '0;url=/?invalid-jwt',
				});
			}
		}
	}

	return resolve(event);
};
