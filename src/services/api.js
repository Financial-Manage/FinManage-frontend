import axios from "axios";

const API_URL = "http://localhost/fin_manage/api_finmanage/routes/incomeRoutes.php";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------ Rotas de Receitas ------------------

// Obter todas as receitas
export const getAllIncomes = async () => {
  try {
    const response = await api.get("/"); // Supondo que a rota `/` retorna todas as receitas
    return response.data;
  } catch (error) {
    console.error("Erro ao obter todas as receitas:", error);
    throw error;
  }
};

//pegar todos usuarios
export const getIncomeById = async (id) => {
  try {
    const response = await api.get(`/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter receita:", error);
    throw error;
  }
};

// Obter receitas por ID de usuário
export const getIncomesByUser = async (userId) => {
  try {
    const response = await api.get(`/?users_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter receitas por usuário:", error);
    throw error;
  }
};

// Criar receita
export const createIncome = async (incomeData) => {
  try {
    const response = await api.post("/", {
      action: "createIncome",
      ...incomeData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    throw error;
  }
};

// Atualizar receita
export const updateIncome = async (id, incomeData) => {
  try {
    const response = await api.post("/", {
      action: "updateIncome",
      id,
      ...incomeData,
    });
    console.log(incomeData)
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    throw error;
  }
};

// Excluir receita
export const deleteIncome = async (id) => {
  try {
    const response = await api.post("/", {
      action: "deleteIncome",
      id,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    throw error;
  }
};



export default api;