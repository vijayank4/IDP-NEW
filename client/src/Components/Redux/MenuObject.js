import { createSlice } from '@reduxjs/toolkit';

const MenuObject = createSlice({
  name: 'MenuItem',
  initialState: {
    data: [],
  },
  reducers: {
    addMenuObject: (state, action) => {
      state.data.push(action.payload);
    },
  },
});

export const { addMenuObject } = MenuObject.actions;
export default MenuObject.reducer;