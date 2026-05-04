import logoImg from './assets/logo.png'
import './TopBar.css'

function TopBar() {
    return (
        <section id='topBar'>
            <img src={logoImg} id='headerLogo' height='60'></img>
        </section>
    )
}

export default TopBar