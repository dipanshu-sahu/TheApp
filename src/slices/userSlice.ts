import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUsersApi,
  updateUserProfileApi,
  userLoginApi,
} from '../apis/userAPI';
import {
  userLoginRequest,
  userLoginResponse,
  UserInfo,
  userUpdateProfileRequest,
} from '../types/user';
import { addAsyncCases, ApiState, createApiState } from '../utils/reduxHelper';

interface UserState {
  user: UserInfo | null;
  loginApi: ApiState;
  fetchUserApi: ApiState;
  updateProfileApi: ApiState;
}

const initialState: UserState = {
  user: null,
  loginApi: createApiState(),
  fetchUserApi: createApiState(),
  updateProfileApi: createApiState(),
};

export const userLogin = createAsyncThunk<userLoginResponse, userLoginRequest>(
  'user/login',
  async (info: userLoginRequest) => {
    try {
      const response = await userLoginApi(info);
      console.log({response})
      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchUsers = createAsyncThunk<UserInfo[]>(
  'user/fetchUsers',
  async () => {
    try {
      const response = await getUsersApi();
      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const updateUserProfile = createAsyncThunk<
  UserInfo,
  { userId: string; payload: userUpdateProfileRequest }
>('user/updateProfile', async ({ userId, payload }) => {
  try {
    const response = await updateUserProfileApi(userId, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    addAsyncCases(
      builder,
      userLogin,
      'loginApi',
      'user'
    );
    addAsyncCases(
      builder,
      fetchUsers,
      'fetchUserApi',
      'user'
    );
    addAsyncCases(
      builder,
      updateUserProfile,
      'updateProfileApi',
      'user'
    )
  }
  // extraReducers: builder => {
  //   builder
  //     .addCase(fetchUsers.pending, state => {
  //       state.isLoading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchUsers.fulfilled, (state, action) => {
  //       state.isLoading = false;
  //       state.users = action.payload || [];
  //     })
  //     .addCase(fetchUsers.rejected, (state, action) => {
  //       state.isLoading = false;
  //       state.error = action.error.message || 'Failed to fetch users';
  //     })
  //     .addCase(updateUserProfile.fulfilled, (state, action) => {
  //       const updatedUser = action.payload;
  //       if (!updatedUser) {
  //         return;
  //       }
  //       const index = state.users.findIndex(user => user.id === updatedUser.id);
  //       if (index !== -1) {
  //         state.users[index] = {
  //           ...state.users[index],
  //           ...updatedUser,
  //         };
  //       } else {
  //         state.users = [updatedUser];
  //       }
  //     });
  // },
});

export default userSlice.reducer;