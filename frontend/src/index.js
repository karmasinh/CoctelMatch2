import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import theme from "./components/Theme";
import { HelmetProvider } from "react-helmet-async";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <HelmetProvider>
          <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
          <App />
        </HelmetProvider>
      </ChakraProvider>
    </Provider>
  </BrowserRouter>
);
