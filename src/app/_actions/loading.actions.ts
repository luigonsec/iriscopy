// loading.actions.ts
import { createAction, props } from '@ngrx/store';

export const setLoading = createAction(
  '[Loading] Set Loading',
  props<{ isLoading: boolean }>()
);
export const unsetLoading = createAction('[Loading] Unset Loading');
