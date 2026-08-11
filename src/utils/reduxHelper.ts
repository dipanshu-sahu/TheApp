import {
  ActionReducerMapBuilder,
  AsyncThunk,
  Draft,
  PayloadAction,
} from '@reduxjs/toolkit';

/**
 * Generic loading/error state for a single async operation.
 * Use `T` to attach optional response data when the slice needs it.
 */
export interface ApiState<T = unknown> {
  readonly loading: boolean;
  readonly error: string | null;
  readonly data?: T | null;
}

export const createApiState = <T = unknown>(): ApiState<T> => ({
  loading: false,
  error: null,
  data: null,
});

/**
 * Attaches the standard pending / fulfilled / rejected cases for an
 * async thunk to a slice builder, removing the boilerplate from every slice.
 *
 * @param builder  - The slice's `extraReducers` builder
 * @param thunk    - The async thunk to handle
 * @param apiKey   - State key holding the `ApiState` for this operation
 * @param dataKey  - Optional state key to write the fulfilled payload into
 * @param onFulfilled - Optional side-effects on success (e.g. set flags)
 */
export const addAsyncCases = <
  State,
  Returned,
  ThunkArg,
  ApiKey extends keyof State,
  DataKey extends keyof State = never,
>(
  builder: ActionReducerMapBuilder<State>,
  // RTK does not publicly export AsyncThunkConfig, so `any` is the only
  // way to accept thunks with heterogeneous ThunkApiConfig generics here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thunk: AsyncThunk<Returned, ThunkArg, any>,
  apiKey: ApiKey,
  dataKey?: DataKey,
  onFulfilled?: (state: Draft<State>, action: PayloadAction<Returned>) => void,
): void => {
  builder
    .addCase(thunk.pending, state => {
      const apiState = state[apiKey] as ApiState;
      (apiState as { loading: boolean; error: string | null }).loading = true;
      (apiState as { loading: boolean; error: string | null }).error = null;
    })
    .addCase(
      thunk.fulfilled,
      (state, action: PayloadAction<Returned>) => {
        const apiState = state[apiKey] as ApiState<Returned>;
        (apiState as { loading: boolean }).loading = false;

        if (dataKey) {
          state[dataKey] = action.payload as State[DataKey];
        } else if (!onFulfilled) {
          (apiState as { data: Returned }).data = action.payload;
        }

        onFulfilled?.(state, action);
      },
    )
    .addCase(thunk.rejected, (state, action) => {
      const apiState = state[apiKey] as ApiState;
      (apiState as { loading: boolean; error: string | null }).loading = false;
      (apiState as { loading: boolean; error: string | null }).error =
        action.error.message ?? 'Something went wrong';
    });
};
