import { createSlice } from '@reduxjs/toolkit';

const UserObject = createSlice({
  name: 'User',
  initialState: {
    data: [],
  },
  reducers: {
    addUserObject: (state, action) => {
      state.data.push(action.payload);
    },
  },
});

export const { addUserObject } = UserObject.actions;
export default UserObject.reducer;