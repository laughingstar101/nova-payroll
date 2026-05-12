import { createBrowserRouter } from "react-router-dom";
// import App from "./App";
import EmployeeRegister from "./components/EmployeeRegister";
import Dashboard from "./components/Dashboard";
import App from './App'
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/employeeRegister", element: <EmployeeRegister/>},
    {path: "/dashboard", element: <ProtectedRoute><Dashboard/></ProtectedRoute>},
])  