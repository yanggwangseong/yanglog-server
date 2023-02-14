import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(CategoryEntity)
		private categoriesRepository: Repository<CategoryEntity>,
	) {}

	async getAllCategory(): Promise<CategoryEntity[]> {
		return await this.categoriesRepository.find({
			where: {
				parentId: IsNull(),
			},
			relations: ['children'],
			order: {
				priority: 'ASC',
			},
		});
	}

	async UpdateCategory(dto: UpdateCategoryDto): Promise<void> {
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
		// 카테고리 삭제
		if (dto.delete) {
			for (const data of dto.delete) {
				const result = await this.categoriesRepository.delete({
					id: data,
				});

				if (result.affected === 0)
					throw new NotFoundException(
						`Could not find category with id ${data}`,
					);
			}
		}
		// 카테고리 수정
		if (dto.update) {
			for (const data of dto.update) {
				const category = new CategoryEntity();
				category.category_name = data.category_name;
				category.priority = data.priority;
				await this.categoriesRepository.update({ id: data.id }, category);

				if (data.children) {
					for (const update_child of data.children) {
						const child_category = new CategoryEntity();
						child_category.parentId = update_child.parentId;
						child_category.category_name = update_child.category_name;
						child_category.priority = update_child.priority;

						await this.categoriesRepository.update(
							{ id: update_child.id },
							child_category,
						);
					}
				}
			}
		}
	}
}
