import { createBrowserRouter } from "react-router-dom";
// import App from "./App";
import EmployeeRegister from "./components/EmployeeRegister";
import Dashboard from "./components/Dashboard";
import App from './App'
import ProtectedRoute from "./ProtectedRoute";
import UpdatePassword from "./components/UpdatePassword";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/employee-register", element: <EmployeeRegister/>},
    {path: "/dashboard", element: <ProtectedRoute><Dashboard/></ProtectedRoute>},
    {path: "update-password", element: <UpdatePassword/>},
])  