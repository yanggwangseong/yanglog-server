import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('manage/categories')
@UseGuards(AccessTokenGuard, RolesGuard)
export class CategoriesController {
	constructor(private categoryService: CategoriesService) {}

	@Get()
	@Roles(UserRole.ADMIN)
	async getAllCategory(): Promise<CategoryEntity[]> {
		return await this.categoryService.getAllCategory();
	}

	@Put()
	@Roles(UserRole.ADMIN)
	async UpdateCategory(@Body() dto: UpdateCategoryDto): Promise<void> {
		return await this.categoryService.UpdateCategory(dto);
	}
}
