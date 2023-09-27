// loading.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as LoadingActions from '../_actions/loading.actions';

export interface State {
  isLoading: boolean;
}

export const initialState: State = {
	isLoading: false,
};

export const loadingReducer = createReducer(
	initialState,
	on(LoadingActions.setLoading, (state, { isLoading }) => ({
		...state,
		isLoading,
	})),
	on(LoadingActions.unsetLoading, (state) => ({ ...state, isLoading: false }))
);
