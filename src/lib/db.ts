import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const sql = postgres(env.DATABASE_URL, { ssl: !dev });

export async function ensureUsersTable() {
	await sql`create table if not exists users (
    id serial primary key,
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null
  )`;
}

export { sql };
