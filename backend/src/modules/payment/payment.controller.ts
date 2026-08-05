import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthUser } from '@common/interfaces/auth-user.interface';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Payment')
@ApiBearerAuth()
@Roles(Role.GUEST, Role.EMPLOYEE, Role.ADMIN)
@Controller('bills')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('order/:orderId')
  @ApiOperation({ summary: 'View the bill for an order. No payment gateway - billing info only.' })
  async findByOrder(@CurrentUser() user: AuthUser, @Param('orderId', ParseUUIDPipe) orderId: string) {
    const bill = await this.paymentService.findByOrder(user, orderId);
    return ApiResponse.success(bill, 'Bill retrieved successfully.');
  }
}
