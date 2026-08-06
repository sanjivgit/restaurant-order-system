import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { OrderService } from './order.service';
import { UserThrottlerGuard } from '@common/guards/user-throttler.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthUser } from '@common/interfaces/auth-user.interface';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  CreateOrderDto,
  createOrderSchema,
  OrderQueryDto,
  orderQuerySchema,
  UpdateOrderStatusDto,
  updateOrderStatusSchema,
} from './dto/order.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.GUEST)
  @UseGuards(UserThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 3600 * 1000 } })
  @ApiOperation({ summary: 'Place an order (guest only, scoped to the table from their guest token).' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(createOrderSchema)) dto: CreateOrderDto) {
    const order = await this.orderService.create(user, dto);
    return ApiResponse.success(order, 'Order placed successfully.');
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiQuery({ name: 'branchId', required: false })
  @ApiQuery({ name: 'tableId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List orders (employee/admin). Employees are scoped to their own branch.' })
  async findAll(@CurrentUser() user: AuthUser, @Query(new ZodValidationPipe(orderQuerySchema)) query: OrderQueryDto) {
    const result = await this.orderService.findAllForStaff(user, query);
    return ApiResponse.success(result.items, 'Orders retrieved successfully.', result.meta);
  }

  @Get('my')
  @Roles(Role.GUEST)
  @ApiOperation({ summary: "List the current guest's orders for their table (guest only)." })
  async findMy(@CurrentUser() user: AuthUser) {
    const orders = await this.orderService.findAllForGuest(user);
    return ApiResponse.success(orders, 'Your orders retrieved successfully.');
  }

  @Get(':id')
  @Roles(Role.GUEST, Role.EMPLOYEE, Role.ADMIN)
  @ApiOperation({ summary: 'Get order details/status. Guests may only view their own table\'s order.' })
  async findOne(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    const order = await this.orderService.findOne(user, id);
    return ApiResponse.success(order, 'Order retrieved successfully.');
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Update order status (employee/admin). Follows the fixed status flow.' })
  async updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema)) dto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderService.updateStatus(user, id, dto);
    return ApiResponse.success(order, 'Order status updated successfully.');
  }
}
