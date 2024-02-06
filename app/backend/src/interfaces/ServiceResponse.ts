export type ServiceMessage = { message: string };

export type ServiceResponseErrorType = 'INVALID_DATA' | 'NOT_FOUND' |
'UNAUTHORIZED' | 'CONFLICT' | 'UNPROCESSABLE';

export type ServiceResponseSuccessType = 'SUCCESSFUL' | 'CREATED';

export type ServiceResponseError = {
  status: ServiceResponseErrorType,
  data: ServiceMessage,
};

export type ServiceResponseSuccess<T> = {
  status: 'SUCCESSFUL' | 'CREATED',
  data: T,
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
