import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    markAsRead(state, action) {
      const id = action.payload;
      state.items = state.items.map(item =>
        item.id === id ? {...item, read: true} : item,
      );
      state.unreadCount = state.items.filter(n => !n.read).length;
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {setNotifications, markAsRead, clearNotifications} =
  notificationSlice.actions;

export default notificationSlice.reducer;
