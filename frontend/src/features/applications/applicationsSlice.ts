import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/api';
import type { Application, PaginationMeta } from '../../types';

interface ApplicationsState {
  myList: Application[];
  myMeta: PaginationMeta;
  jobApplications: Application[];
  jobApplicationsMeta: PaginationMeta;
  appliedJobIds: Record<string, boolean>;
  submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  jobAppsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ApplicationsState = {
  myList: [],
  myMeta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  jobApplications: [],
  jobApplicationsMeta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  appliedJobIds: {},
  submitStatus: 'idle',
  listStatus: 'idle',
  jobAppsStatus: 'idle',
  error: null,
};

export const submitApplication = createAsyncThunk(
  'applications/submit',
  async (payload: { jobId: string; coverLetter: string; resumeUrl?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/applications', payload);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      return rejectWithValue(msg);
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/applications/me');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load applications');
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/fetchByJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/jobs/${jobId}/applications`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load applications');
    }
  }
);

export const checkApplied = createAsyncThunk(
  'applications/checkApplied',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/applications/check/${jobId}`);
      return { jobId, applied: data.applied };
    } catch {
      return rejectWithValue('Failed to check application status');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError(state) {
      state.error = null;
      state.submitStatus = 'idle';
    },
    resetJobApplications(state) {
      state.jobApplications = [];
      state.jobAppsStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.submitStatus = 'loading';
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.appliedJobIds[action.payload.jobId] = true;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchMyApplications.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.myList = action.payload.data;
        state.myMeta = action.payload.meta;
      })
      .addCase(fetchJobApplications.pending, (state) => {
        state.jobAppsStatus = 'loading';
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.jobAppsStatus = 'succeeded';
        state.jobApplications = action.payload.data;
        state.jobApplicationsMeta = action.payload.meta;
      })
      .addCase(checkApplied.fulfilled, (state, action) => {
        state.appliedJobIds[action.payload.jobId] = action.payload.applied;
      });
  },
});

export const { clearApplicationError, resetJobApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer;
