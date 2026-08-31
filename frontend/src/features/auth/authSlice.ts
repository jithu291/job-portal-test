import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const stored = localStorage.getItem('auth');
const initial: AuthState = stored
  ? JSON.parse(stored)
  : { user: null, accessToken: null, refreshToken: null, status: 'idle', error: null };

function persist(state: AuthState) {
  localStorage.setItem(
    'auth',
    JSON.stringify({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    })
  );
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: { email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const refreshSession = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    const { refreshToken } = (getState() as { auth: AuthState }).auth;
    try {
      const { data } = await api.post('/auth/refresh', { refreshToken });
      return data;
    } catch {
      return rejectWithValue('Session expired');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch {
    return rejectWithValue('Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('auth');
    },
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string; user: User }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      persist(state);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        persist(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        persist(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        persist(state);
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('auth');
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        persist(state);
      });
  },
});

export const { logoutUser, setTokens, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
