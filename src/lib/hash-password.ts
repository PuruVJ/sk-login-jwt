import { hash } from 'bcrypt';

export function hashPassword(password: string) {
	return hash(password, 10);
}
