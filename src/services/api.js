import axios from "axios";

const API_URL = "http://localhost/fin_manage/api_finmanage/public";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//pegar todos usuarios
export const getAllUsers = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter usuário.", error);
    throw error;
  }
};

//pegar usuario por id
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/?id=${id}`); // chama rota get com id
    return response.data;
  } catch (error) {
    console.error("Erro ao obter usuário", error);
    throw error;
  }
};

//criar usuário
export const createUser = async (userData) => {
  try {
    const response = await api.post("/", {
      action: "createUser",
      ...userData, //define qual case será usado em $_POST["action"] no backend
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

//atualizar usuário
export const updateUser = async (id, userData) => {
  try {
    const response = await api.post("/", {
      action: "updateUser",
      id,
      ...userData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

//excluir usuário
export const deleteUser = async (id) => {
  try {
    const response = await api.post("/", {
      action: "deleteUser",
      id,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw error;
  }
};


export default api;