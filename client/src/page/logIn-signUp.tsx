import { useState } from "react";


export default function AuthPage() {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
        {/* Login Section */}
        <section>
          <h1>Login</h1>
          <form>
            <div>
              <label>Email</label>
              <input type="email" />
            </div>
  
            <div>
              <label>Password</label>
              <input type="password" />
            </div>
  
            <div>
              <button type="submit">Login</button>
            </div>
          </form>
        </section>
  
        {/* Sign Up Section */}
        <section>
          <h1>Sign Up</h1>
          <form>
            <div>
              <label>Email</label>
              <input type="email" />
            </div>
  
            <div>
              <label>Password</label>
              <input type="password" />
            </div>
  
            <div>
              <label>Confirm Password</label>
              <input type="password" />
            </div>
  
            <div>
              <button type="submit">Sign Up</button>
            </div>
          </form>
        </section>
      </div>
    );
  }
  