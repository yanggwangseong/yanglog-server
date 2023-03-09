export interface PostType {
	id: string;
	title: string;
	subtitle: string;
	category: string;
	img: string;
	description: string;
	published: Date;
	author: ProfileType;
}

export interface ProfileType {
	name: string;
	img: string;
	designation: string;
}
