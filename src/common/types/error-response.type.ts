export type ErrorResponse = {
  statusCode: number;
  errorsMessages: {
    message: string;
    field: string;
  }[];
  timestamp: string;
  path: string;
};
