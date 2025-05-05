import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login-signup.css";

const AuthService = {
  authenticateUser: async (email: string, password: string): Promise<boolean> => {
    // Simulated success only for demo user
    return email === "test@example.com" && password === "password123";
  },
};

interface LoginInfo {
  email: string;
  password: string;
}

interface SignupInfo extends LoginInfo {
  confirmPassword: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [loginInfo, setLoginInfo] = useState<LoginInfo>({ email: "", password: "" });
  const [signupInfo, setSignupInfo] = useState<SignupInfo>({ email: "", password: "", confirmPassword: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>, setter: Function) => {
    const { name, value } = e.target;
    setter((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await AuthService.authenticateUser(loginInfo.email, loginInfo.password);
    if (success) {
      alert("Login successful!");
      setLoginInfo({ email: "", password: "" });
    } else {
      navigate("/error", { state: { message: "Invalid email or password." } });
    }
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password, confirmPassword } = signupInfo;

    if (!email || !password || !confirmPassword) {
      navigate("/error", { state: { message: "All fields are required." } });
      return;
    }

    if (password !== confirmPassword) {
      navigate("/error", { state: { message: "Passwords do not match." } });
      return;
    }

    if (password.length < 8) {
      navigate("/error", { state: { message: "Password must be at least 8 characters long." } });
      return;
    }

    const success = await AuthService.authenticateUser(email, password);

    if (success) {
      alert("Signup successful!");
      setSignupInfo({ email: "", password: "", confirmPassword: "" });
      setIsLogin(true); 
    } else {
      navigate("/error", { state: { message: "Signup failed. Try again." } });
    }
  };

  return (
    <div className="auth-page">
      
      <button className="home-button" onClick={() => navigate("/")}>Home</button>

      <h1>{isLogin ? "Login" : "Sign Up"}</h1>

      <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={isLogin ? loginInfo.email : signupInfo.email}
          onChange={(e) => handleChange(e, isLogin ? setLoginInfo : setSignupInfo)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={isLogin ? loginInfo.password : signupInfo.password}
          onChange={(e) => handleChange(e, isLogin ? setLoginInfo : setSignupInfo)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={signupInfo.confirmPassword}
            onChange={(e) => handleChange(e, setSignupInfo)}
            required
          />
        )}
        <button type="submit">{isLogin ? "Click here to Login" : "Click here to Sign Up"}</button>
      </form>

      <p className="toggle-mode">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)}>Click here to Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)}>Click here to Login</button>
          </>
        )}
      </p>
    </div>
  );
}