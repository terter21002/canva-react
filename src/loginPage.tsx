import React from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { App } from "./app";

function LoginPage() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <App />
      </SignedIn>
    </div>
  );
}

export default LoginPage;
