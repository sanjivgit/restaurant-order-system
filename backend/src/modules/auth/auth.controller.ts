import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '@common/decorators/public.decorator';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { GuestTokenDto, guestTokenSchema, RefreshTokenDto, refreshTokenSchema, StaffLoginDto, staffLoginSchema } from './dto/auth.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('guest/token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue a short-lived guest token for a table (QR scan entry point). No account required.' })
  @ApiBody({ schema: { example: { tableId: 'uuid', token: 'optional existing guest token' } } })
  async guestToken(@Body(new ZodValidationPipe(guestTokenSchema)) dto: GuestTokenDto) {
    const result = await this.authService.issueGuestToken(dto);
    return ApiResponse.success(result, 'Guest token issued successfully.');
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Employee/Admin login. Role is embedded in the returned access token.' })
  @ApiBody({ schema: { example: { email: 'admin@restaurant.com', password: 'password123' } } })
  async login(@Body(new ZodValidationPipe(staffLoginSchema)) dto: StaffLoginDto) {
    const result = await this.authService.staffLogin(dto);
    return ApiResponse.success(result, 'Login successful.');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a valid refresh token for a new access/refresh token pair.' })
  async refresh(@Body(new ZodValidationPipe(refreshTokenSchema)) dto: RefreshTokenDto) {
    const result = await this.authService.refresh(dto);
    return ApiResponse.success(result, 'Token refreshed successfully.');
  }
}
