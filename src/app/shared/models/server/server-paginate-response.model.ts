export interface PagedResponse<T> {
  data: T[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
}
