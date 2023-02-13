import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('manage/categories')
export class CategoriesController {
	constructor(private categoryService: CategoriesService) {}

	@Get()
	Hello() {
		return this.categoryService.Hello();
	}
}
