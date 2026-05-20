import {
    ActionReducerMapBuilder,
    AsyncThunk,
    PayloadAction,
} from '@reduxjs/toolkit';

export interface ApiState<T = any> {
    loading: boolean;
    error: string | null;
    data?: T | null;
}

export const createApiState = <T>() => ({
    loading: false,
    error: null,
    data: null as T | null,
});

export const addAsyncCases = <
    State,
    Returned,
    ThunkArg,
    ApiKey extends keyof State,
    DataKey extends keyof State
>(
    builder: ActionReducerMapBuilder<State>,
    thunk: AsyncThunk<Returned, ThunkArg, any>,
    apiKey: ApiKey,
    dataKey?: DataKey
) => {
    builder

        // pending
        .addCase(thunk.pending, state => {
            const apiState = state[apiKey] as ApiState;

            apiState.loading = true;
            apiState.error = null;
        })

        // fulfilled
        .addCase(
            thunk.fulfilled,
            (state, action: PayloadAction<Returned>) => {
                const apiState = state[apiKey] as ApiState<Returned>;

                apiState.loading = false;

                // shared state update
                if (dataKey) {
                    state[dataKey] = action.payload as State[DataKey];
                }

                // local api state update
                else {
                    apiState.data = action.payload;
                }
            }
        )

        // rejected
        .addCase(thunk.rejected, (state, action) => {
            const apiState = state[apiKey] as ApiState;

            apiState.loading = false;

            apiState.error =
                (action.payload as string) ||
                action.error.message ||
                'Something went wrong';
        });
};