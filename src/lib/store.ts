import { configureStore } from "@reduxjs/toolkit";
import { wordpressApi } from "./wordpressApi";

export const store = configureStore({
  reducer: { [wordpressApi.reducerPath]: wordpressApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wordpressApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
