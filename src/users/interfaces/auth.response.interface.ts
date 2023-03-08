export interface AuthResponse {
	accessToken: string;
	refreshToken?: string;
	id: string;
	name: string;
	email: string;
}
