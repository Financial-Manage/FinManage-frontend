import axios from "axios";

const API_URL =
  "http://localhost/fin_manage/api_finmanage/routes/categoriesRoutes.php";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCategories = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter todas as categorias:", error);
    throw error;
  }
};

//pega todas as categoriar por id
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter categorias:", error);
    throw error;
  }
};

// Obter despesas por ID de usuário
export const getCategoriesByUser = async (userId) => {
  try {
    const response = await api.get(`/?users_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter categorias por usuário:", error);
    throw error;
  }
};

export const getCategoryByType = async (type) =>  {
  try {
    const response = await api.get(`/?type=${type}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter categorias por tipo:", error);
    throw error;
  }
}

//crair categoria
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/", {
      action: "createCategory",
      ...categoryData,
    });
    console.log(categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
};

//atualizar categoria
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.post("/", {
      action: "updateCategory",
      id,
      ...categoryData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    throw error;
  }
};

// Excluir receita
export const deleteCategory = async (id) => {
  try {
    const response = await api.post("/", {
      action: "deleteCategory",
      id,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    throw error;
  }
};

export default api;