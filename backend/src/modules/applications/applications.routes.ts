import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate, requireUser } from '../../middleware/auth';
import { validateBody, validateQuery } from '../../middleware/validate';
import { applySchema, applicationListQuerySchema } from './applications.validation';
import * as applicationsController from './applications.controller';

const router = Router();

router.use(authenticate, requireUser);

router.post('/', validateBody(applySchema), asyncHandler(applicationsController.apply));
router.get('/me', validateQuery(applicationListQuerySchema), asyncHandler(applicationsController.myApplications));
router.get('/check/:jobId', asyncHandler(applicationsController.checkApplied));

export default router;
