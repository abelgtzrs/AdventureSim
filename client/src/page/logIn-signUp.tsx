import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client"; // Assuming LOGIN and REGISTER are defined here or imported
import "./styles/login-signup.css"; // We'll update this CSS

// Define your GraphQL mutations here or import them
// Ensure these match your backend schema
const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

interface LoginInfo {
  email: string;
  password: string;
}

interface SignupInfo {
  username: string; // Added username field
  email: string;
  password: string;
  confirmPassword: string;
}

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formError, setFormError] = useState<string | null>(null);

  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const [signupInfo, setSignupInfo] = useState<SignupInfo>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginMutation, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN, {
      onCompleted: (data) => {
        localStorage.setItem("id_token", data.login.token);
        navigate("/"); // Or to a dashboard page
      },
      onError: (error) => {
        setFormError(
          error.message || "Login failed. Please check your credentials."
        );
      },
    });

  const [registerMutation, { loading: signupLoading, error: signupError }] =
    useMutation(REGISTER, {
      onCompleted: (data) => {
        localStorage.setItem("id_token", data.register.token);
        navigate("/"); // Or to a dashboard page, perhaps with a "Welcome!" message
      },
      onError: (error) => {
        setFormError(error.message || "Signup failed. Please try again.");
      },
    });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    formType: AuthMode
  ) => {
    const { name, value } = e.target;
    setFormError(null); // Clear previous errors on input change

    if (formType === "login") {
      setLoginInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateSignup = (): boolean => {
    if (
      !signupInfo.username ||
      !signupInfo.email ||
      !signupInfo.password ||
      !signupInfo.confirmPassword
    ) {
      setFormError("Please fill in all sign up fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(signupInfo.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (signupInfo.password !== signupInfo.confirmPassword) {
      setFormError("Passwords do not match.");
      return false;
    }
    if (signupInfo.password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const validateLogin = (): boolean => {
    if (!loginInfo.email || !loginInfo.password) {
      setFormError("Please fill in all login fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(loginInfo.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setFormError(null);
    try {
      await registerMutation({
        variables: {
          username: signupInfo.username,
          email: signupInfo.email,
          password: signupInfo.password,
        },
      });
    } catch (err) {
      // Error is handled by useMutation's onError
      console.error("Signup submission error", err);
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setFormError(null);
    try {
      await loginMutation({
        variables: {
          email: loginInfo.email,
          password: loginInfo.password,
        },
      });
    } catch (err) {
      // Error is handled by useMutation's onError
      console.error("Login submission error", err);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setFormError(null); // Clear errors when switching modes
    // Optionally reset form fields
    setLoginInfo({ email: "", password: "" });
    setSignupInfo({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button
            onClick={() => navigate("/")}
            className="home-button"
            aria-label="Go to Home"
          >
            &larr; {/* Left arrow for home */}
          </button>
          <h2>{authMode === "login" ? "Welcome Back!" : "Create Account"}</h2>
        </div>

        {formError && <p className="error-message">{formError}</p>}

        {authMode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginInfo.email}
                onChange={(e) => handleInputChange(e, "login")}
                required
                aria-describedby={
                  formError && loginInfo.email === ""
                    ? "error-message"
                    : undefined
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginInfo.password}
                onChange={(e) => handleInputChange(e, "login")}
                required
                aria-describedby={
                  formError && loginInfo.password === ""
                    ? "error-message"
                    : undefined
                }
              />
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging In..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                type="text"
                name="username"
                placeholder="your_username"
                value={signupInfo.username}
                onChange={(e) => handleInputChange(e, "signup")}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={signupInfo.email}
                onChange={(e) => handleInputChange(e, "signup")}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={signupInfo.password}
                onChange={(e) => handleInputChange(e, "signup")}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirmPassword">Confirm Password</label>
              <input
                id="signup-confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={signupInfo.confirmPassword}
                onChange={(e) => handleInputChange(e, "signup")}
                required
              />
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={signupLoading}
            >
              {signupLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        <div className="auth-toggle">
          {authMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button onClick={toggleAuthMode} className="toggle-button">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={toggleAuthMode} className="toggle-button">
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
