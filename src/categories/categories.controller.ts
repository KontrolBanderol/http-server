import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import ResponseRo from 'src/common/ro/response.ro';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/governance/admins/decorators/roles.decorator';
import { Role } from 'src/governance/admins/enums/role.enum';
import { JwtAdminGuard } from 'src/governance/admins/guards/jwt-admin.guard';
import { RolesGuard } from 'src/governance/admins/guards/role.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
        constructor(
            private categoriesService: CategoriesService,
        ) {}

        @ApiOperation({ summary: 'Create a category' })
        @ApiBearerAuth('admin-token')
        @UseGuards(JwtAdminGuard, RolesGuard)
        @Roles(Role.ADMINISTRATOR)
        @Post('/createCategory')
        async createCategory(@Body() dto: CreateCategoryDto): Promise<ResponseRo> {
            const categoriesModel = await this.categoriesService.createCategory(dto);
            return {
                ok: true,
                message: 'The category has been successfuly added',
                result: categoriesModel,
            }
        }
    
        // @dev create JWT admin guard
        @ApiOperation({ summary: 'Get a category' })
        //@ApiBearerAuth('admin-token')
        //@UseGuard(AdminAuthGuard)
        @Get('/getCategory/:name')
        async getCategory(@Param('name') categoryName: string): Promise<ResponseRo> {
            const categoriesModel = await this.categoriesService.getCategory({ name: categoryName });
            if (!categoriesModel) {
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
            }
            return {
                ok: true,
                result: categoriesModel,
            }
        }
    
        @ApiOperation({ summary: 'Get all categories' })
        @Get('/getAll')
        async getAllCategories(): Promise<ResponseRo> {
            return {
                ok: true,
                result: await this.categoriesService.getAll(),
            }
        }
}
