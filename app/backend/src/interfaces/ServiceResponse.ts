export type ServiceMessage = { message: string };

export type ServiceResponseErrorType = 'INVALID_DATA' | 'NOT_FOUND' |
'UNAUTHORIZED' | 'CONFLICT';

export type ServiceResponseError = {
  status: ServiceResponseErrorType,
  data: ServiceMessage,
};

export type ServiceResponseSuccess<T> = {
  status: 'SUCCESSFUL' | 'CREATED',
  data: T,
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
