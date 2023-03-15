import { Request } from 'express';

interface User {
	sub: string;
	refreshToken: string;
}

// Request 타입 확장
export interface AuthenticatedRequest extends Request {
	user: User;
}

interface GoogleUser {
	email: string;
	photo: string;
	firstName: string;
	lastName: string;
}

export interface GoogleAuthRequest extends Request {
	user: GoogleUser;
}
