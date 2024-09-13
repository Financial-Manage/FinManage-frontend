import { Link } from "react-router-dom";

import styles from "./NavBar.module.css";
import Header from "../../Header/Header";

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <div>
        <Header title={"FinManage"} />
      </div>

      <div className={styles.divLinks}>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/receitas">Receitas</Link>
          </li>
          <li>
            <Link to="/despesas">Despesas</Link>
          </li>
          <li>
            <Link to="/notas">Orçamentos</Link>
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
