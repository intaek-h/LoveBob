import "../public/github-light.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { AppProps } from "next/app";
import Layout from "../components/layouts";
import { ThemeProvider } from "styled-components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalStyle from "../components/styles/globalStyles";
import { lightTheme } from "../themes/styleTheme";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const toastContainerProps: ToastContainerProps = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  newestOnTop: false,
  draggable: false,
  closeOnClick: true,
  pauseOnHover: false,
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer {...toastContainerProps} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
