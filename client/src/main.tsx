import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./utils/apolloClient"; // Make sure this path is correct

// Pages
import HomePage from "./page/HomePage";
import LoginSignUp from "./page/logIn-signUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "logIn-signUp",
        element: <LoginSignUp />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);
