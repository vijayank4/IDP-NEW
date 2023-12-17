import { createSlice } from '@reduxjs/toolkit';

const RouterObject = createSlice({
  name: 'Router',
  initialState: {
    data: [],
  },
  reducers: {
    addRouterObject: (state, action) => {
      state.data.push(action.payload);
    },
  },
});

export const { addRouterObject } = RouterObject.actions;
export default RouterObject.reducer;