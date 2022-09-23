import postgres from 'postgres';
import { env } from '$env/dynamic/private';

const sql = postgres(env.DATABASE_URL);

sql`create table if not exists users (
	id serial primary key,
	username varchar(255) not null,
	email varchar(255) not null,
	password varchar(255) not null
)`;

export { sql };
