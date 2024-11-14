import axios from "axios";

const API_URL =
  "http://localhost/fin_manage/api_finmanage/routes/budgetsRoutes.php";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllBudgets = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter todos os orçamentos:", error);
    throw error;
  }
};

export const getBudgetById = async (id) => {
  try {
    const response = await api.get(`/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter orçamento:", error);
    throw error;
  }
};

export const checkBudgetAlert = async (budgetId) => {
  try {
    const response = await api.post("/", {
      action: "checkBudgetAlert", 
      budget_id: budgetId
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar o limite do orçamentos:", error);
    throw error;
  }
}


export const getBudgetsByUser = async (userId) => {
  try {
    const response = await api.get(`/?users_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter orçamentos por usuário:", error);
    throw error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await api.post("/", {
      action: "createBudget",
      ...budgetData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    throw error;
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const response = await api.post("/", {
      action: "updateBudget",
      id,
      ...budgetData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar orçamento:", error);
    throw error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await api.post("/", {
      action: "deleteBudget",
      id,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir orçamento:", error);
    throw error;
  }
};


export default api;
