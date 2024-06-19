import { AppUiProvider } from "@canva/app-ui-kit";
import * as React from "react";
import { createRoot } from "react-dom/client";
import LoginPage from "./loginPage";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your publishable key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
//   //console.log("Missing Publishable Key");
// }

const root = createRoot(document.getElementById("root")!);
function render() {
  root.render(
    <AppUiProvider>
      {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}
      <App />
      {/* </ClerkProvider> */}
    </AppUiProvider>
  );
}

render();

if (import.meta.hot) {
  import.meta.hot.accept("./app", render);
}
