import { createBrowserRouter } from "react-router-dom";
// import App from "./App";
import EmployeeRegister from "./components/EmployeeRegister";
import CompanyLogin from "./components/CompanyLogin";
import Dashboard from "./components/Dashboard";
import App from './App'

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/employeeRegister", element: <EmployeeRegister/>},
    {path: "/companyLogin", element: <CompanyLogin/>},
    {path: "/dashboard", element: <Dashboard/>},
])  