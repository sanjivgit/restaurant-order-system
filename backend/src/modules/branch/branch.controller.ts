import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { CreateBranchDto, createBranchSchema, UpdateBranchDto, updateBranchSchema } from './dto/branch.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Branch')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a branch (admin only).' })
  async create(@Body(new ZodValidationPipe(createBranchSchema)) dto: CreateBranchDto) {
    const branch = await this.branchService.create(dto);
    return ApiResponse.success(branch, 'Branch created successfully.');
  }

  @Get()
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiOperation({ summary: 'List branches, optionally filtered by restaurant.' })
  async findAll(@Query('restaurantId') restaurantId?: string) {
    const branches = await this.branchService.findAll(restaurantId);
    return ApiResponse.success(branches, 'Branches retrieved successfully.');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a branch by id.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const branch = await this.branchService.findOne(id);
    return ApiResponse.success(branch, 'Branch retrieved successfully.');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a branch.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBranchSchema)) dto: UpdateBranchDto,
  ) {
    const branch = await this.branchService.update(id, dto);
    return ApiResponse.success(branch, 'Branch updated successfully.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a branch.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.branchService.remove(id);
    return ApiResponse.success(null, 'Branch deleted successfully.');
  }
}
