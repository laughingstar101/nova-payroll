import logoImg from '../assets/logo.png'
import styles from './TopBar.module.css'

export default function TopBar() {
    return (
        <section className={styles.topBar}>
            <img src={logoImg} className={styles.headerLogo}></img>
        </section>
    )
}