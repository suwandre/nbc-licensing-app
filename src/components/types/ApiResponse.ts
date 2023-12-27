export type ApiResponse = {
    status: number;
    error: string | undefined;
    message: string;
    data: any | undefined;
    pagination: Pagination | undefined;
    version: number;
}

export type Pagination = {
    totalItems: number;
    page: number;
    pageSize: number;
}