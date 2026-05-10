import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import gameReducer from './gameSlice.js';

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
