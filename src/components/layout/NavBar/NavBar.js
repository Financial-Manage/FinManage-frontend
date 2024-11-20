import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import Logo from "../../../assets/img/LogoFin.png";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sessionToken"); // Remove o token de sessão
    navigate("/"); // Redireciona para a página de login
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <img src={Logo} alt="Logo FinManage" className={styles.logo} />
      </div>

      <div className={styles.divLinks}>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
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
            <Link to="/notificacoes">
              <FontAwesomeIcon icon={faBell} />
            </Link>
          </li>
          <li>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
