import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
	constructor() {}

	Hello() {
		return 'hi';
	}
}
