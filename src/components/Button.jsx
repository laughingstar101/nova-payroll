import styles from './Button.module.css'
import { Link } from 'react-router-dom'

export default function Button() {
    return (
            <Link to='/employeeRegister' className={styles.button}>REGISTER</Link>
    )
}