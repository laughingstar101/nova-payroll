import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import App from './App'
import ProtectedRoute from "./ProtectedRoute";
import UpdatePassword from "./components/UpdatePassword";
import CompanyRegister from "./components/CompanyRegister";
import Profile from "./components/Profile";
import Leave from "./components/Leave"

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/dashboard", element: <ProtectedRoute><Dashboard/></ProtectedRoute>},
    {path: "/update-password", element: <UpdatePassword/>},
    {path: "/company-register", element: <CompanyRegister/>},
    {path: "/profile", element: <Profile/>},
    {path: "/leave", element: <Leave/>},
])  