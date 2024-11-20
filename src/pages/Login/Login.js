import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authRoutes"; // Importando a rota de login
import styles from "./Login.module.css";
import NavBar from "../../components/layout/NavBar/NavBar";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(loginData); // Chamada para login
      if (result.status === "success") {
        localStorage.setItem("sessionToken", result.token); // Salva o token
        navigate("/dashboard"); // Redireciona para o dashboard
      } else {
        setErrorMessage(result.message || "Erro ao realizar login");
      }
    } catch (error) {
      setErrorMessage("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentContainer}>
        <div className={styles.formContainer}>
          <h2>Login</h2>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={loginData.email}
              onChange={handleInputChange}
              required
            />
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className={styles.btnPrimary}>
              Entrar
            </button>
          </form>
          <p>
            Não tem uma conta?{" "}
            <span className={styles.link} onClick={() => navigate("/register")}>
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
