import axios from "axios";

const API_URL = "http://localhost/fin_manage/api_finmanage/routes/expenseRoutes.php";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const getAllExpenses = async () => {
  try {
    const response = await api.get("/"); 
    return response.data;
  } catch (error) {
    console.error("Erro ao obter todas as despesas:", error);
    throw error;
  }
};

//pegar todos usuarios
export const getExpenseById = async (id) => {
  try {
    const response = await api.get(`/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter receita:", error);
    throw error;
  }
};

// Obter despesas por ID de usuário
export const getExpensesByUser = async (userId) => {
  try {
    const response = await api.get(`/?users_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter despesas por usuário:", error);
    throw error;
  }
};

// Criar receita
export const createExpense = async (ExpenseData) => {
  try {
    const response = await api.post("/", {
      action: "createExpense",
      ...ExpenseData,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    throw error;
  }
};

// Atualizar receita
export const updateExpense = async (id, ExpenseData) => {
  try {
    const response = await api.post("/", {
      action: "updateExpense",
      id,
      ...ExpenseData,
    });
    console.log(ExpenseData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    throw error;
  }
};

// Excluir receita
export const deleteExpense = async (id) => {
  try {
    const response = await api.post("/", {
      action: "deleteExpense",
      id,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir despesa:", error);
    throw error;
  }
};

export default api;