import { Routes, Route } from "react-router-dom";
import CompanyRegister from "./CompanyRegister";
import CompanyLogin from './CompanyLogin';
import EmployeeRegister from './EmployeeRegister'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<CompanyRegister/>}></Route>
            <Route path="/employeeRegister" element={<EmployeeRegister/>}></Route>
            <Route path="/companyLogin" element={<CompanyLogin/>}></Route>
        </Routes>
    )
}