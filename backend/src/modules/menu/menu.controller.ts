import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  CreateMenuItemDto,
  createMenuItemSchema,
  MenuQueryDto,
  menuQuerySchema,
  UpdateMenuItemDto,
  updateMenuItemSchema,
} from './dto/menu.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Menu')
@Controller('menu-items')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a menu item (admin only).' })
  async create(@Body(new ZodValidationPipe(createMenuItemSchema)) dto: CreateMenuItemDto) {
    const item = await this.menuService.create(dto);
    return ApiResponse.success(item, 'Menu item created successfully.');
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'branchId', required: true })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'isVeg', required: false })
  @ApiQuery({ name: 'isAvailable', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({ summary: 'List/search/filter menu items for a branch. Public - used by the QR menu.' })
  async findAll(@Query(new ZodValidationPipe(menuQuerySchema)) query: MenuQueryDto) {
    const result = await this.menuService.findAll(query);
    return ApiResponse.success(result.items, 'Menu items retrieved successfully.', result.meta);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a menu item by id. Public.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.menuService.findOne(id);
    return ApiResponse.success(item, 'Menu item retrieved successfully.');
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a menu item (admin only).' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateMenuItemSchema)) dto: UpdateMenuItemDto,
  ) {
    const item = await this.menuService.update(id, dto);
    return ApiResponse.success(item, 'Menu item updated successfully.');
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft-delete a menu item (admin only).' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.menuService.remove(id);
    return ApiResponse.success(null, 'Menu item deleted successfully.');
  }
}
