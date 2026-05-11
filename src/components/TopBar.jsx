import logoImg from '../assets/logo.png'
import styles from './TopBar.module.css'

export default function TopBar() {
    return (
        <section className={styles.topBar}>
            <img src={logoImg} id='headerLogo' height='60'></img>
        </section>
    )
}