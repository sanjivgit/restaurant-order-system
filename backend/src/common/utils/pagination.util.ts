import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@common/constants/app.constants';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function normalizePagination(query: PaginationQuery) {
  const page = query.page && query.page > 0 ? Math.floor(query.page) : DEFAULT_PAGE;
  const limit = query.limit && query.limit > 0 ? Math.min(Math.floor(query.limit), MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationResult<T>(items: T[], total: number, page: number, limit: number): PaginationResult<T> {
  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}
