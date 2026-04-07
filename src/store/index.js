import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import lookupsReducer from './slices/lookupsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lookups: lookupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Okta token objects may have non-serializable date fields
        ignoredActions: ['auth/setCredentials'],
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Pre-typed hooks — import these instead of plain useDispatch / useSelector
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
