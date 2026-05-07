export const successResponse = (
  res: any,
  message: string,
  data: any = null,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: any,
  message: string,
  statusCode: number = 500,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
