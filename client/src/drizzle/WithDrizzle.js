import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import { DrizzleProvider } from "./hooks";
import getDrizzleStore from "./setup";
import Spinner from "../components/utils/Spinner";

const DrizzleConnectionSetter = ({ DSCStore }) => {
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
  return <Spinner />;
};
const withDrizzle = Component => {
  const WithDrizzle = props => {
    const { DSCStore, Web3Store } = props;
    if (!Web3Store.web3) {
      return <Component {...props} />;
    } else if (DSCStore.drizzle) {
      return (
        <DrizzleProvider drizzle={DSCStore.drizzle}>
          <Component {...props} />
        </DrizzleProvider>
      );
    }
    return <DrizzleConnectionSetter {...props} />;
  };
  return compose(
    inject("DSCStore", "Web3Store"),
    observer
  )(WithDrizzle);
};

export default withDrizzle;
