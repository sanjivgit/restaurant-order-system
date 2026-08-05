import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { CreateRestaurantDto, createRestaurantSchema, UpdateRestaurantDto, updateRestaurantSchema } from './dto/restaurant.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Restaurant')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a restaurant (admin only).' })
  async create(@Body(new ZodValidationPipe(createRestaurantSchema)) dto: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(dto);
    return ApiResponse.success(restaurant, 'Restaurant created successfully.');
  }

  @Get()
  @ApiOperation({ summary: 'List all restaurants.' })
  async findAll() {
    const restaurants = await this.restaurantService.findAll();
    return ApiResponse.success(restaurants, 'Restaurants retrieved successfully.');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a restaurant by id.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const restaurant = await this.restaurantService.findOne(id);
    return ApiResponse.success(restaurant, 'Restaurant retrieved successfully.');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a restaurant.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateRestaurantSchema)) dto: UpdateRestaurantDto,
  ) {
    const restaurant = await this.restaurantService.update(id, dto);
    return ApiResponse.success(restaurant, 'Restaurant updated successfully.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a restaurant.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantService.remove(id);
    return ApiResponse.success(null, 'Restaurant deleted successfully.');
  }
}
