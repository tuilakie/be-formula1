export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Meta;
}

export interface Meta {
  total: number;
  pages: number;
  current: number;
  size: number;
}
