import { ThemeProvider } from "@material-ui/styles";
import { QueryClientProvider } from "react-query";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

import { queryClient } from "./services/queryClient"

import i18n from "./core/i18n";
import theme from "./theme/createTheme";
import Main from "./Main/Main";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <CssBaseline />
            <Main />
          </I18nextProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
