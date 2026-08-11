import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUsersApi,
  updateUserProfileApi,
  userLoginApi,
} from '../apis/userAPI';
import {
  UserLoginRequest,
  UserInfo,
  UserUpdateProfileRequest,
} from '../types/user';
import { addAsyncCases, ApiState, createApiState } from '../utils/reduxHelper';
import {
  getUserSession,
  saveUserSession,
} from '../utils/secureStorage';
import {
  loadStoredAuthToken,
  signOut,
} from '../utils/authSession';

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  loginApi: ApiState;
  fetchUserApi: ApiState;
  updateProfileApi: ApiState;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isRestoringSession: true,
  loginApi: createApiState(),
  fetchUserApi: createApiState(),
  updateProfileApi: createApiState(),
};

const resolveCurrentUser = (users: UserInfo[]): UserInfo | null =>
  users[0] ?? null;

export const userLogin = createAsyncThunk<UserInfo, UserLoginRequest>(
  'user/login',
  async credentials => {
    await userLoginApi(credentials);
    const users = await getUsersApi();
    const user = resolveCurrentUser(users);
    if (!user) {
      throw new Error('Unable to load user profile after login.');
    }
    await saveUserSession(user);
    return user;
  },
);

export const fetchUsers = createAsyncThunk<UserInfo | null>(
  'user/fetchUsers',
  async () => {
    const users = await getUsersApi();
    const user = resolveCurrentUser(users);
    if (user) {
      await saveUserSession(user);
    }
    return user;
  },
);

export const restoreSession = createAsyncThunk<UserInfo | null>(
  'user/restoreSession',
  async () => {
    const token = await loadStoredAuthToken();
    if (!token) {
      return null;
    }

    try {
      const users = await getUsersApi();
      const user = resolveCurrentUser(users);
      if (user) {
        await saveUserSession(user);
        return user;
      }
    } catch {
      const cachedUser = await getUserSession();
      if (cachedUser) {
        return cachedUser;
      }
      await signOut();
      return null;
    }

    return getUserSession();
  },
);

export const logout = createAsyncThunk<void, void>('user/logout', async () => {
  await signOut();
});

export const updateUserProfile = createAsyncThunk<
  UserInfo,
  { userId: string; payload: UserUpdateProfileRequest }
>('user/updateProfile', async ({ userId, payload }) => {
  // `updateUserProfileApi` is typed to return `Promise<UserInfo>` directly,
  // so no cast is required here.
  const updatedUser = await updateUserProfileApi(userId, payload);
  await saveUserSession(updatedUser);
  return updatedUser;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    forceLogout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.loginApi = createApiState();
      state.fetchUserApi = createApiState();
      state.updateProfileApi = createApiState();
    },
  },
  extraReducers: builder => {
    addAsyncCases(builder, userLogin, 'loginApi', 'user', state => {
      state.isAuthenticated = true;
    });

    addAsyncCases(builder, fetchUsers, 'fetchUserApi', undefined, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    });

    builder
      .addCase(restoreSession.pending, state => {
        state.isRestoringSession = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoringSession = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(restoreSession.rejected, state => {
        state.isRestoringSession = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.loginApi = createApiState();
        state.fetchUserApi = createApiState();
        state.updateProfileApi = createApiState();
      });

    addAsyncCases(builder, updateUserProfile, 'updateProfileApi', 'user');
  },
});

export const { forceLogout } = userSlice.actions;

export default userSlice.reducer;
