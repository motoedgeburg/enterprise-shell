import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { lookupsService } from '../../api/lookupsService';

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const fetchLookups = createAsyncThunk(
  'lookups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await lookupsService.getAll();
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Failed to load lookups');
    }
  },
  {
    // Skip the API call if lookups have already been loaded successfully.
    condition: (_, { getState }) => {
      const { status } = getState().lookups;
      return status === 'idle' || status === 'failed';
    },
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  // Shape mirrors the /api/lookups response
  departments: [],
  statuses: [],
  employmentTypes: [],
  notificationChannels: [],
  accessLevels: [],
};

const lookupsSlice = createSlice({
  name: 'lookups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookups.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLookups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(fetchLookups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export default lookupsSlice.reducer;
