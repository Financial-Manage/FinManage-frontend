import axios from "axios";

const API_URL = "http://localhost/fin_manage/api_finmanage/routes/usersRoutes.php";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login do usuário
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/", {
      action: "login",
      ...credentials,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    throw error;
  }
};

// Registro de novo usuário
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/", {
      action: "register",
      ...userData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

// Verificar sessão do usuário
export const checkSession = async (token) => {
  try {
    const response = await api.post("/", {
      action: "checkSession",
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    throw error;
  }
};

// Logout do usuário
export const logoutUser = async (token) => {
  try {
    const response = await api.post("/", {
      action: "logout",
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar logout:", error);
    throw error;
  }
};

export default api;
