import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./utils/apolloClient"; // Make sure this path is correct
import RootLayout from "./layout/RootLayout";
import StoryPlayer from "./player/storyPlayer";
import StoryCreate from "./page/storyCreate";

// Pages
import HomePage from "./page/HomePage";
import LoginSignUp from "./page/logIn-signUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "logIn-signUp", element: <LoginSignUp /> },
      { path: "create", element: <StoryCreate /> },
      { path: "adventure/:id", element: <StoryPlayer /> },
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
