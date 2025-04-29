import { useState, ChangeEvent, FormEvent } from "react";

// Define interfaces for form data
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
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const [signupInfo, setSignupInfo] = useState<SignupInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFormData: (value: any) => void
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login Info:", loginInfo);
  };

  const handleSignupSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signup Info:", signupInfo);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
      {/* Login Section */}
      <section>
        <h1>Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={(e) => handleChange(e, setLoginInfo)}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={(e) => handleChange(e, setLoginInfo)}
            />
          </div>

          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </section>

      {/* Sign Up Section */}
      <section>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignupSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={signupInfo.email}
              onChange={(e) => handleChange(e, setSignupInfo)}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={signupInfo.password}
              onChange={(e) => handleChange(e, setSignupInfo)}
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={signupInfo.confirmPassword}
              onChange={(e) => handleChange(e, setSignupInfo)}
            />
          </div>

          <div>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </section>
    </div>
  );
}
