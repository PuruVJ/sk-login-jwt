import { env } from '$env/dynamic/private';
import { sql } from '$lib/db';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ resolve, event }) => {
	// Create just in case
	await sql`create table if not exists users (
    id serial primary key,
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null
  )`;

	// set event.locals to whatever you want
	const cookies = event.cookies;

	const sessionID = cookies.get('sessionID');
	if (sessionID) {
		// @ts-ignore
		event.locals.user = jwt.decode(sessionID, { json: true });
	}

	return resolve(event);
};
