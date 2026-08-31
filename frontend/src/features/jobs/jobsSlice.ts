import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api';
import type {
  DashboardStats,
  ExperienceLevel,
  Job,
  JobCategory,
  PaginationMeta,
} from '../../types';

interface JobFilters {
  page: number;
  limit: number;
  category: JobCategory | '';
  experienceLevel: ExperienceLevel | '';
  search: string;
}

interface JobsState {
  list: Job[];
  meta: PaginationMeta;
  filters: JobFilters;
  selectedJob: Job | null;
  stats: DashboardStats | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  formStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  statsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobsState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: { page: 1, limit: 10, category: '', experienceLevel: '', search: '' },
  selectedJob: null,
  stats: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  formStatus: 'idle',
  statsStatus: 'idle',
  error: null,
};

function buildParams(filters: JobFilters) {
  const params: Record<string, string | number> = {
    page: filters.page,
    limit: filters.limit,
  };
  if (filters.category) params.category = filters.category;
  if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
  if (filters.search) params.search = filters.search;
  return params;
}

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { getState, rejectWithValue }) => {
    const { filters } = (getState() as { jobs: JobsState }).jobs;
    try {
      const { data } = await api.get('/admin/jobs', { params: buildParams(filters) });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/jobs/${id}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Job not found');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (payload: Partial<Job>, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/jobs', payload);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || 'Failed to create job';
      return rejectWithValue(msg);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, ...payload }: Partial<Job> & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/jobs/${id}`, payload);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || 'Failed to update job';
      return rejectWithValue(msg);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/jobs/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'jobs/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/dashboard/stats');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load stats');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<JobFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetSelectedJob(state) {
      state.selectedJob = null;
      state.detailStatus = 'idle';
      state.formStatus = 'idle';
      state.error = null;
    },
    clearJobError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.listStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createJob.pending, (state) => {
        state.formStatus = 'loading';
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.formStatus = 'succeeded';
      })
      .addCase(createJob.rejected, (state, action) => {
        state.formStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateJob.pending, (state) => {
        state.formStatus = 'loading';
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.formStatus = 'succeeded';
        state.selectedJob = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.formStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.list = state.list.filter((j) => j.id !== action.payload);
      })
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsStatus = 'loading';
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetSelectedJob, clearJobError } = jobsSlice.actions;
export default jobsSlice.reducer;
