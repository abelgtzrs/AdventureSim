import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN, REGISTER } from "../graphql/mutations";
import "./styles/login-signup.css";

interface LoginInfo {
  email: string;
  password: string;
}

interface SignupInfo {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const [signupInfo, setSignupInfo] = useState<SignupInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [login] = useMutation(LOGIN);
  const [register] = useMutation(REGISTER);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (
      !signupInfo.email ||
      !signupInfo.password ||
      !signupInfo.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (signupInfo.password !== signupInfo.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (signupInfo.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const { data } = await register({
        variables: {
          username: signupInfo.email.split("@")[0],
          email: signupInfo.email,
          password: signupInfo.password,
        },
      });

      const token = data.register.token;
      localStorage.setItem("id_token", token);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Signup failed. Please try again.");
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: {
          email: loginInfo.email,
          password: loginInfo.password,
        },
      });

      const token = data.login.token;
      localStorage.setItem("id_token", token);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Invalid email or password.");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="auth-page">
      <h1>Login/Sign-Up</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="auth-forms">
        <form onSubmit={handleLoginSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginInfo.email}
            onChange={(e) => handleChange(e, setLoginInfo)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginInfo.password}
            onChange={(e) => handleChange(e, setLoginInfo)}
          />
          <button type="submit">Login</button>
        </form>
        <form onSubmit={handleSignupSubmit}>
          <h2>Sign Up</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupInfo.email}
            onChange={(e) => handleChange(e, setSignupInfo)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupInfo.password}
            onChange={(e) => handleChange(e, setSignupInfo)}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={signupInfo.confirmPassword}
            onChange={(e) => handleChange(e, setSignupInfo)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <button onClick={handleHomeClick}>Go to Home</button>
    </div>
  );
}
