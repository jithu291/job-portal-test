import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api';
import type {
  CategoryCount,
  ExperienceLevel,
  JobCategory,
  PaginationMeta,
  PublicJob,
} from '../../types';

interface PublicJobFilters {
  page: number;
  limit: number;
  category: JobCategory | '';
  experienceLevel: ExperienceLevel | '';
  location: string;
  search: string;
  sort: 'newest' | 'oldest';
}

interface PublicJobsState {
  list: PublicJob[];
  meta: PaginationMeta;
  filters: PublicJobFilters;
  featured: PublicJob[];
  categories: CategoryCount[];
  selectedJob: PublicJob | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  featuredStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PublicJobsState = {
  list: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: { page: 1, limit: 10, category: '', experienceLevel: '', location: '', search: '', sort: 'newest' },
  featured: [],
  categories: [],
  selectedJob: null,
  listStatus: 'idle',
  featuredStatus: 'idle',
  detailStatus: 'idle',
  error: null,
};

function buildParams(filters: PublicJobFilters) {
  const params: Record<string, string | number> = {
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
  };
  if (filters.category) params.category = filters.category;
  if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
  if (filters.location) params.location = filters.location;
  if (filters.search) params.search = filters.search;
  return params;
}

export const fetchPublicJobs = createAsyncThunk(
  'publicJobs/fetchPublicJobs',
  async (_, { getState, rejectWithValue }) => {
    const { filters } = (getState() as { publicJobs: PublicJobsState }).publicJobs;
    try {
      const { data } = await api.get('/jobs', { params: buildParams(filters) });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load jobs');
    }
  }
);

export const fetchFeaturedJobs = createAsyncThunk(
  'publicJobs/fetchFeaturedJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs/featured');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load featured jobs');
    }
  }
);

export const fetchCategoryCounts = createAsyncThunk(
  'publicJobs/fetchCategoryCounts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs/categories');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load categories');
    }
  }
);

export const fetchPublicJobById = createAsyncThunk(
  'publicJobs/fetchPublicJobById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Job not found');
    }
  }
);

const publicJobsSlice = createSlice({
  name: 'publicJobs',
  initialState,
  reducers: {
    setPublicFilters(state, action: PayloadAction<Partial<PublicJobFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetSelectedPublicJob(state) {
      state.selectedJob = null;
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.listStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedJobs.pending, (state) => {
        state.featuredStatus = 'loading';
      })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featuredStatus = 'succeeded';
        state.featured = action.payload;
      })
      .addCase(fetchCategoryCounts.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchPublicJobById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicJobById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedJob = action.payload;
      })
      .addCase(fetchPublicJobById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPublicFilters, resetSelectedPublicJob } = publicJobsSlice.actions;
export default publicJobsSlice.reducer;
