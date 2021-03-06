import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter } from "react-router-dom";
import { StylesProvider } from "@material-ui/core";
import { GlobalDataProvider } from "./components/GlobalDataProvider";
import { AlertDialogProvider } from "./components/AlertDialog/AlertDialogContext";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
		padding: 0;
		font-size: 16px;
		text-decoration: none;
		list-style: none;
		font-family: "Roboto", sans-serif;
		box-sizing: border-box;
		/* overflow: hidden; */
	}
`;

ReactDOM.render(
  <React.StrictMode>
    <AlertDialogProvider>
      <GlobalDataProvider>
        <StylesProvider injectFirst>
          <GlobalStyles />
          <BrowserRouter>
          <App />
          </BrowserRouter>
        </StylesProvider>
      </GlobalDataProvider>
    </AlertDialogProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
