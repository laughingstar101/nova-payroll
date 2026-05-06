import TopBar from "./components/TopBar.jsx";
import styles from './CompanyRegister.module.css'
import Button from "./components/Button.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CompanyRegister() {
    const [companyName, setCompanyName] = useState('');

    return (
        <div className={styles.signup}>
            <TopBar />
            <section className={styles.signupContainer}>
                <h1>Register Company!</h1>    
                <section className={styles.formContainer}>
                    <label htmlFor="nameInput" className={styles.formLabel}>Company name:</label>
                    <input 
                        type="text" 
                        id="nameInput" 
                        className={styles.formInput} 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </section>
                <Button/>
                <Link to='/companyLogin' className={styles.loginBtn}>Have company? Login</Link>
            </section>
        </div>
    )
}