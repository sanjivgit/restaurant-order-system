"use client";

import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

interface ReduxProviderShape {
  children: React.ReactNode;
}

const ReduxProvider: FC<ReduxProviderShape> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
