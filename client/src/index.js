import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Dashboard from "./components/Dashboard";
import { Provider } from "mobx-react";
import Web3Store from "./stores/Web3Store";
import DSCStore from "./stores/DSCStore";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme as rimbleTheme } from "rimble-ui";
import "react-toastify/dist/ReactToastify.min.css";

const theme = {
  ...rimbleTheme
};
// override
// theme.colors.black = "#111";
//
// const GlobalStyle = createGlobalStyle`
//   body {
//     background-color: #333333;
//     color: white;
//   }
// `;
const App = () => (
  <ThemeProvider theme={theme}>
    {/*<GlobalStyle />*/}
    <Provider Web3Store={Web3Store} DSCStore={DSCStore}>
      <Dashboard />
      <ToastContainer
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </Provider>
  </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
