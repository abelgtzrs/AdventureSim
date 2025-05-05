import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import './styles/login-signup.css';

// Mock AuthService for demonstration purposes
const AuthService = {
  _authenticateUser: async (email: string, password: string): Promise<boolean> => {
    // Replace this with actual authentication logic
    return email === "nit9801@abc.com" && password === "Admin123!";
  },
  get authenticateUser() {
    return this._authenticateUser;
  },
  set authenticateUser(value) {
    this._authenticateUser = value;
  },
};

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
    email: '',
    password: '',
  });

  const [signupInfo, setSignupInfo] = useState<SignupInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({ ...prevState, [name]: value }));
  };
  
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupInfo({ email: "", password: "", confirmPassword: "" }); // Clear any previous error messages
    console.log('Signup Info:', JSON.stringify(signupInfo, null, 2));
    alert('Signup successful!');

  // Check if all fields are filled
  if (!signupInfo.email || !signupInfo.password || !signupInfo.confirmPassword) {
      console.error("All fields are required.");
      alert("Please fill in all fields.");
      return;
    }
  
    // Check if passwords match
    if (signupInfo.password !== signupInfo.confirmPassword) {
      console.error("Passwords do not match.");
      alert("Passwords do not match. Please try again.");
      return;
    }
  
    // Check password strength (example: minimum 8 characters)
    if (signupInfo.password.length < 8) {
      console.error("Password must be at least 8 characters long.");
      alert("Password must be at least 8 characters long.");
      return;
    }
  
    // Proceed with signup logic
   setErrorMessage(null); // Clear any previous error messages
    const success = await AuthService.authenticateUser(signupInfo.email, signupInfo.password);

    if (success) {
      alert('Signup successful!');
      setSignupInfo({ email: '', password: '', confirmPassword: '' }); // Clear form fields
    } else {
      setErrorMessage('Signup failed. Please try again.');
    }
  };
  
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Login Info:", JSON.stringify(loginInfo, null, 2)); // Accessing loginInfo from state
    
      const success = await AuthService.authenticateUser(loginInfo.email, loginInfo.password);

    if (success) {
      alert('Login successful!');
      setLoginInfo({ email: '', password: '' }); // Clear form fields
    } else {
      setErrorMessage('Invalid email or password.');
    }
  };

const handleHomeClick = () => {
  navigate('/');
};

return (
  <div className="auth-page">
    <h1> Let The Adventure Begin </h1>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    <div className="auth-forms">
      <form onSubmit={handleLoginSubmit}>
        
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
};