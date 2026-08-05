import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthUser } from '@common/interfaces/auth-user.interface';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { CreateEmployeeDto, createEmployeeSchema, UpdateEmployeeDto, updateEmployeeSchema } from './dto/employee.dto';
import { ApiResponse } from '@common/responses/api-response';
import { PaginationQuery } from '@common/utils/pagination.util';

@ApiTags('Employee')
@ApiBearerAuth()
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('me')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get the currently authenticated employee/admin profile.' })
  async me(@CurrentUser() user: AuthUser) {
    const employee = await this.employeeService.findOne(user.employeeId!);
    return ApiResponse.success(employee, 'Profile retrieved successfully.');
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create an employee (admin only).' })
  async create(@Body(new ZodValidationPipe(createEmployeeSchema)) dto: CreateEmployeeDto) {
    const employee = await this.employeeService.create(dto);
    return ApiResponse.success(employee, 'Employee created successfully.');
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'branchId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({ summary: 'List employees (admin only), paginated and filterable by branch.' })
  async findAll(
    @Query('branchId') branchId?: string,
    @Query() query?: PaginationQuery,
  ) {
    const result = await this.employeeService.findAll(branchId, {
      page: query?.page ? Number(query.page) : undefined,
      limit: query?.limit ? Number(query.limit) : undefined,
      search: query?.search,
    });
    return ApiResponse.success(result.items, 'Employees retrieved successfully.', result.meta);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get an employee by id (admin only).' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const employee = await this.employeeService.findOne(id);
    return ApiResponse.success(employee, 'Employee retrieved successfully.');
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update an employee (admin only).' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateEmployeeSchema)) dto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeeService.update(id, dto);
    return ApiResponse.success(employee, 'Employee updated successfully.');
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft-delete (deactivate) an employee (admin only).' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.employeeService.remove(id);
    return ApiResponse.success(null, 'Employee deleted successfully.');
  }
}
