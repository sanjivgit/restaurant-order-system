import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthUser } from '@common/interfaces/auth-user.interface';
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
  @ApiOperation({ summary: 'Create a branch in the authenticated user\'s restaurant (admin only).' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(createBranchSchema)) dto: CreateBranchDto) {
    const branch = await this.branchService.create(dto, user.restaurantId!);
    return ApiResponse.success(branch, 'Branch created successfully.');
  }

  @Get()
  @ApiOperation({ summary: 'List branches for the authenticated user\'s restaurant.' })
  async findAll(@CurrentUser() user: AuthUser) {
    const branches = await this.branchService.findAll(user.restaurantId!);
    return ApiResponse.success(branches, 'Branches retrieved successfully.');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a branch by id (scoped to your restaurant).' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    const branch = await this.branchService.findOne(id, user.restaurantId!);
    return ApiResponse.success(branch, 'Branch retrieved successfully.');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a branch (scoped to your restaurant).' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBranchSchema)) dto: UpdateBranchDto,
  ) {
    const branch = await this.branchService.update(id, dto, user.restaurantId!);
    return ApiResponse.success(branch, 'Branch updated successfully.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a branch (scoped to your restaurant).' })
  async remove(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    await this.branchService.remove(id, user.restaurantId!);
    return ApiResponse.success(null, 'Branch deleted successfully.');
  }
}
