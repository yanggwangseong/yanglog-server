import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(CategoryEntity)
		private categoriesRepository: Repository<CategoryEntity>,
	) {}

	async UpdateCategory(dto: UpdateCategoryDto) {
		//새로운 카테고리 생성
		if (dto.append) {
			for (const append of dto.append) {
				const category = new CategoryEntity();
				category.id = uuidv4();
				category.category_name = append.category_name;
				category.parentId = null;
				category.priority = append.priority;

				await this.categoriesRepository.save(category);

				if (append.children) {
					for (const append_child of append.children) {
						const child_category = new CategoryEntity();
						child_category.id = uuidv4();
						child_category.parentId = category.id;
						child_category.category_name = append_child.category_name;
						child_category.priority = append_child.priority;

						await this.categoriesRepository.save(child_category);
					}
				}
			}
		}

		return 'hi';
	}
}
