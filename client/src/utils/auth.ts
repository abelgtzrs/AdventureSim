import { type JwtPayload, jwtDecode } from 'jwt-decode';

interface ExtendedJwt extends JwtPayload {
  data: {
    username: string;
    email: string;
    _id: string;
  };
}

class AuthService {
  getProfile() {
    return jwtDecode<ExtendedJwt>(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }

  async authenticateUser(email: string, password: string): Promise<boolean> {
    try {
      // Simulate an API call to validate login credentials
      if (email === 'nita9801@abc.com' && password === 'Admin123!') {
        const fakeToken = 'your-jwt-token'; // Replace with a real token from your backend
        this.login(fakeToken);
        return true;
      } else {
        console.error('Invalid email or password.');
        return false;
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      return false;
    }
  }
}

export default new AuthService();