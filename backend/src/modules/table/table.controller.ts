import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TableService } from './table.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { CreateTableDto, createTableSchema, UpdateTableDto, updateTableSchema } from './dto/table.dto';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Table')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @ApiOperation({ summary: 'Create a table; a unique QR code URL is generated automatically (admin only).' })
  async create(@Body(new ZodValidationPipe(createTableSchema)) dto: CreateTableDto) {
    const table = await this.tableService.create(dto);
    return ApiResponse.success(table, 'Table created successfully.');
  }

  @Get()
  @ApiQuery({ name: 'branchId', required: true })
  @ApiOperation({ summary: 'List tables for a branch (admin only).' })
  async findAll(@Query('branchId', ParseUUIDPipe) branchId: string) {
    const tables = await this.tableService.findAll(branchId);
    return ApiResponse.success(tables, 'Tables retrieved successfully.');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a table by id (admin only).' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const table = await this.tableService.findOne(id);
    return ApiResponse.success(table, 'Table retrieved successfully.');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a table (admin only).' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateTableSchema)) dto: UpdateTableDto,
  ) {
    const table = await this.tableService.update(id, dto);
    return ApiResponse.success(table, 'Table updated successfully.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a table (admin only).' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tableService.remove(id);
    return ApiResponse.success(null, 'Table deleted successfully.');
  }
}
