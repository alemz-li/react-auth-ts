import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface AuthState {
  accessToken: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: { accessToken: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { accessToken } }: PayloadAction<{ accessToken: string }>,
    ) => {
      state.accessToken = accessToken;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
