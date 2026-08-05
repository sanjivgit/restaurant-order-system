import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthUser } from '@common/interfaces/auth-user.interface';
import { ApiResponse } from '@common/responses/api-response';
import { ForbiddenActionException } from '@common/exceptions/app.exception';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'branchId', required: false })
  @ApiOperation({ summary: 'Admin dashboard stats: orders by status, today\'s sales, active employees.' })
  async admin(@Query('branchId') branchId?: string) {
    const stats = await this.dashboardService.adminStats(branchId);
    return ApiResponse.success(stats, 'Dashboard stats retrieved successfully.');
  }

  @Get('employee')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @ApiQuery({ name: 'branchId', required: false, description: 'Required for admins; employees default to their own branch.' })
  @ApiOperation({ summary: 'Employee dashboard: current active orders for the branch.' })
  async employee(@CurrentUser() user: AuthUser, @Query('branchId') branchId?: string) {
    const targetBranchId = user.role === Role.EMPLOYEE ? user.branchId! : branchId;

    if (!targetBranchId) {
      throw new ForbiddenActionException('branchId query param is required for admins.');
    }

    const stats = await this.dashboardService.employeeStats(targetBranchId);
    return ApiResponse.success(stats, 'Dashboard stats retrieved successfully.');
  }
}
