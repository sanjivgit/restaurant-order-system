import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { CreateCategoryDto, createCategorySchema, UpdateCategoryDto, updateCategorySchema } from './dto/category.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Menu Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a menu category (admin only).' })
  async create(@Body(new ZodValidationPipe(createCategorySchema)) dto: CreateCategoryDto) {
    const category = await this.categoryService.create(dto);
    return ApiResponse.success(category, 'Category created successfully.');
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'branchId', required: true })
  @ApiOperation({ summary: 'List active categories for a branch. Public - used by the QR menu.' })
  async findAll(@Query('branchId', ParseUUIDPipe) branchId: string) {
    const categories = await this.categoryService.findAll(branchId, true);
    return ApiResponse.success(categories, 'Categories retrieved successfully.');
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get a category by id.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.categoryService.findOne(id);
    return ApiResponse.success(category, 'Category retrieved successfully.');
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a category (admin only).' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateCategorySchema)) dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, dto);
    return ApiResponse.success(category, 'Category updated successfully.');
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft-delete a category (admin only).' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);
    return ApiResponse.success(null, 'Category deleted successfully.');
  }
}
