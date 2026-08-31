import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateQuery } from '../../middleware/validate';
import { publicJobListQuerySchema } from './public-jobs.validation';
import * as publicJobsController from './public-jobs.controller';

const router = Router();

router.get('/featured', asyncHandler(publicJobsController.featured));
router.get('/categories', asyncHandler(publicJobsController.categories));
router.get('/', validateQuery(publicJobListQuerySchema), asyncHandler(publicJobsController.list));
router.get('/:id', asyncHandler(publicJobsController.getOne));

export default router;
