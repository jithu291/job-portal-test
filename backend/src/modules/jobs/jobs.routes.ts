import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate, requireAdmin } from '../../middleware/auth';
import { validateBody, validateQuery } from '../../middleware/validate';
import { createJobSchema, updateJobSchema, jobListQuerySchema } from './jobs.validation';
import { applicationListQuerySchema } from '../applications/applications.validation';
import * as jobsController from './jobs.controller';
import * as applicationsController from '../applications/applications.controller';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard/stats', asyncHandler(jobsController.stats));
router.get('/jobs', validateQuery(jobListQuerySchema), asyncHandler(jobsController.list));
router.get('/jobs/:jobId/applications', validateQuery(applicationListQuerySchema), asyncHandler(applicationsController.jobApplications));
router.get('/jobs/:id', asyncHandler(jobsController.getOne));
router.post('/jobs', validateBody(createJobSchema), asyncHandler(jobsController.create));
router.put('/jobs/:id', validateBody(updateJobSchema), asyncHandler(jobsController.update));
router.delete('/jobs/:id', asyncHandler(jobsController.remove));

export default router;
