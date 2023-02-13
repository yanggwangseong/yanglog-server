import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('manage/categories')
@UseGuards(AccessTokenGuard, RolesGuard)
export class CategoriesController {
	constructor(private categoryService: CategoriesService) {}

	@Put()
	@Roles(UserRole.ADMIN)
	async UpdateCategory(@Body() dto: UpdateCategoryDto) {
		return await this.categoryService.UpdateCategory(dto);
	}
}
