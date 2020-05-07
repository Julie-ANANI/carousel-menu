export interface Pagination {
  limit?: any; // todo remove
  offset?: number;
  currentPage?: number;
  totalPage?: number;
  parPage?: number;
  propertyName?: string;
  paginatorNumber?: Array<number>;
  nextPage?: number;
  previousPage?: number;
}
