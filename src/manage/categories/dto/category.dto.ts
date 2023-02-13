import {
	ArrayMinSize,
	IsBoolean,
	IsNumber,
	IsString,
	IsUUID,
} from 'class-validator';

export class CategoryDTO {
	@IsString()
	id: string;

	@IsString()
	category_name: string;

	@IsString()
	parentId: string;

	@IsNumber()
	priority: number; // 카테고리 순서

	@ArrayMinSize(0)
	children: CategoryDTO[];
}
