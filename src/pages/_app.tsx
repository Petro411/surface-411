import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/style.css";
import "@radix-ui/themes/styles.css";
import "@/styles/globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContextProvider from "@/context/AuthContext";
import { toastConfig } from "react-simple-toasts";
import type { AppProps } from "next/app";
import { Theme } from "@radix-ui/themes";


toastConfig({
  theme: "dark",
});
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { QueryProvider } from "@/components";

// Optional: Customize NProgress style
NProgress.configure({ showSpinner: false, speed: 400 });

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  NProgress.done();
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <AuthContextProvider>
        <Theme>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
          >
            <Component {...pageProps} />
          </GoogleOAuthProvider>
        </Theme>
      </AuthContextProvider>
    </QueryProvider>
  );
}
