import { Link } from "react-router-dom";

import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../assets/img/LogoFin.png";

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <img src={Logo} alt="Logo FinManage" className={styles.logo} />
      </div>

      <div className={styles.divLinks}>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/categorias">Categorias</Link>
          </li>
          <li>
            <Link to="/orcamento">Orçamentos</Link>
          </li>
          <li>
            <Link to="/receitas">Receitas</Link>
          </li>
          <li>
            <Link to="/despesas">Despesas</Link>
          </li>
          <li>
            <Link to="/notificacoes"><FontAwesomeIcon icon={faBell}/></Link>
          </li>

          <li>
            <Link to="/tasklist">Sair</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
