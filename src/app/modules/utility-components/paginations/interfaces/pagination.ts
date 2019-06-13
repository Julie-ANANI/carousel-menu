export interface Pagination {
  limit?: any; // todo remove
  offset?: number; // todo remove ?
  currentPage?: number;
  totalCount?: number; // todo remove ?
  totalPage?: number;
  parPage?: number; // todo remove ?
  propertyName?: string //todo remove ?
  paginatorNumber?: Array<number>;
  nextPage?: number;
  previousPage?: number;
}
