import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import NavBar from "../../components/layout/NavBar/NavBar";
import { registerUser } from "../../services/authRoutes";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const result = await registerUser(userData); // Chamada para login
      if (result.status === "success") {
        localStorage.setItem("sessionToken", result.token); // Salva o token
        navigate("/"); // Redireciona para o dashboard
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
        <h2>Cadastro</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <form onSubmit={handleRegister}>
          <label>Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Digite seu nome"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
          <label>Sobrenome</label>
          <input
            type="text"
            name="lastname"
            placeholder="Digite seu sobrenome"
            value={userData.lastname}
            onChange={handleInputChange}
            required
          />
          <label>Nome de usuário</label>
          <input
            type="text"
            name="username"
            placeholder="Digite seu nome de usuário"
            value={userData.username}
            onChange={handleInputChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Digite seu email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
          <label>Senha</label>
          <input
            type="password"
            name="password"
            placeholder="Digite sua senha"
            value={userData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className={styles.btnPrimary}>
            Cadastrar
          </button>
        </form>
        <p>
          Já tem uma conta?{" "}
          <span
            className={styles.link}
            onClick={() => navigate("/login")}
          >
            Faça login
          </span>
        </p>
      </div>
      </div>
    </div>
  );
}

export default Register;
