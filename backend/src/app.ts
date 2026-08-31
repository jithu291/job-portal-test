import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import jobsRoutes from './modules/jobs/jobs.routes';
import publicJobsRoutes from './modules/public-jobs/public-jobs.routes';
import applicationsRoutes from './modules/applications/applications.routes';

const app = express();

app.use(helmet());

const allowedOrigins = env.frontendUrl.split(',').map((url) => url.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, origin ?? allowedOrigins[0]);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', publicJobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', jobsRoutes);

app.use(errorHandler);

export default app;
