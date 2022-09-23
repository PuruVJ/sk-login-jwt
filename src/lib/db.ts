import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const sql = postgres(env.DATABASE_URL, { ssl: !dev });

console.log({ JWT_KEY: env.JWT_KEY });

export { sql };
