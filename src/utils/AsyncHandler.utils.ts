import { Request, Response, NextFunction } from "express";

const async_handler = (
  request_Handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(request_Handler(req, res, next)).catch((err) => next(err));
  };
};

export default async_handler;
