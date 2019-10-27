import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import { DrizzleProvider } from "./hooks";
import getDrizzleStore from "./setup";

const DrizzleConnectionSetter = props => {
  const { DSCStore, Component } = props;
  const drizzle = getDrizzleStore();
  useEffect(() => {
    if (!DSCStore.drizzle) {
      const unsubscribe = drizzle.store.subscribe(() => {
        const drizzleState = drizzle.store.getState();
        if (drizzleState.drizzleStatus.initialized) {
          !DSCStore.drizzle && DSCStore.setStore(drizzle);
          unsubscribe();
        }
      });
      return unsubscribe;
    }
  }, [DSCStore, drizzle]);
  return <Component {...props} />;
};
const withDrizzle = Component => {
  const WithDrizzle = props => {
    const { DSCStore } = props;
    if (!DSCStore.drizzleConnected) {
      return <Component {...props} />;
    } else if (DSCStore.drizzle) {
      return (
        <DrizzleProvider drizzle={DSCStore.drizzle}>
          <DrizzleConnectionSetter Component={Component} {...props} />
        </DrizzleProvider>
      );
    }
    return <DrizzleConnectionSetter Component={Component} {...props} />;
  };
  return compose(
    inject("DSCStore"),
    observer
  )(WithDrizzle);
};

export default withDrizzle;
