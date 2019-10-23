import React from "react";
import { compose } from "recompose";
import { inject, observer } from "mobx-react";
import { DrizzleProvider } from "./hooks";

const withDrizzle = Component => {
  const WithDrizzle = props => {
    const { DSCStore } = props;
    if (!DSCStore.drizzle) {
      return <Component {...props} />;
    }
    return (
      <DrizzleProvider drizzle={DSCStore.drizzle}>
        <Component {...props} />
      </DrizzleProvider>
    );
  };
  return compose(
    inject("DSCStore"),
    observer
  )(WithDrizzle);
};

export default withDrizzle;
