import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client';
import '../src/main.css';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import pages to main
import HomePage from './page/HomePage';
import LoginSignUp from './page/logIn-signUp';
import Error from './page/Error.js'
import AuthPage from './page/logIn-signUp';
// Removed incorrect import of ReactDOM


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <LoginSignUp />
      }, {
        path: '/',
        element: <AuthPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)


 