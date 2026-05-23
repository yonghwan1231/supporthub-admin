import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

type DataAxiosWithoutBodyMethod = <T = unknown, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>,
) => Promise<T>;

type DataAxiosWithBodyMethod = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
) => Promise<T>;

type DataAxiosInstance = Omit<
  AxiosInstance,
  "delete" | "get" | "patch" | "post" | "put"
> &
  Record<"get" | "delete", DataAxiosWithoutBodyMethod> &
  Record<"post" | "patch" | "put", DataAxiosWithBodyMethod>;

export class ApiClientError extends Error {
  payload?: unknown;
  status?: number;

  constructor(message: string, status?: number, payload?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.payload = payload;
  }
}

export function isUnauthorizedApiError(error: unknown) {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  );
}

const axiosClient = axios.create();

axiosClient.interceptors.response.use(
  (res) => res.data,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data as { message?: string } | undefined;

      throw new ApiClientError(
        payload?.message ?? "요청 처리에 실패했습니다.",
        error.response?.status,
        error.response?.data,
      );
    }

    throw error;
  },
);

export const apiClient = axiosClient as DataAxiosInstance;
