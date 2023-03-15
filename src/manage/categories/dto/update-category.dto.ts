import { ArrayMinSize, IsString, IsUUID } from 'class-validator';
import { CategoryDTO } from './category.dto';

export class UpdateCategoryDto {
	@ArrayMinSize(0)
	append!: CategoryDTO[];

	@ArrayMinSize(0)
	@IsUUID(4, { each: true })
	delete!: string[];

	@ArrayMinSize(0)
	update!: CategoryDTO[];
}
