import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || 'body';
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      });
      return next(new AppError('Validation failed', 422, errors));
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || 'query';
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      });
      return next(new AppError('Validation failed', 422, errors));
    }
    res.locals.query = result.data;
    next();
  };
}
