import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 