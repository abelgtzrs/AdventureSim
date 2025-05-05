import React, { createContext, useContext, useEffect, useState } from "react";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = !!token;

  // Optional: decode token here to set user (if JWT stores user data)
  useEffect(() => {
    if (!token) return;
    // You can add logic to decode and validate token if needed
  }, [token]);

  // Apollo Client setup
  const httpLink = new HttpLink({
    uri: "http://localhost:3001/graphql", // your GraphQL endpoint
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
};
