import React, { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar/NavBar";
import Select from "../../components/layout/Select/Select";
import styles from "./Budgets.module.css";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  getAllBudgets,
  checkBudgetAlert,
} from "../../services/budgetsRoutes";
import { getCategoryByType } from "../../services/categoriesRoutes";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState({});
  const [newBudget, setNewBudget] = useState({
    description: "",
    category_id: "",
    amount: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryResponse = await getCategoryByType("expense");
        const formattedCategories = categoryResponse.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategories(formattedCategories);

        const budgetResponse = await getAllBudgets();
        setBudgets(Array.isArray(budgetResponse) ? budgetResponse : []);

        const alerts = {};
        for (const budget of budgetResponse) {
          const alertResponse = await checkBudgetAlert(budget.id);
          alerts[budget.id] = alertResponse.status; // Armazena o `status` diretamente
        }
        setBudgetAlerts(alerts);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchData();
  }, []);

  // Função para lidar com inputs de texto
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  }

  // Função para lidar com o `Select` de categoria
  function handleSelectChange(value) {
    setSelectedCategory(value); // Define o valor selecionado
    setNewBudget({ ...newBudget, category_id: value }); // Atualiza `category_id` no `newBudget`
  }

  async function addBudget() {
    if (!newBudget.amount || !newBudget.category_id) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createBudget(newBudget);
      const response = await getAllBudgets();
      setBudgets(Array.isArray(response) ? response : []);
      setNewBudget({ description: "", category_id: "", amount: "" });
      setSelectedCategory(""); // Limpa a seleção de categoria
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
    }
  }

  function editBudget(id) {
    const budgetToEdit = budgets.find((budget) => budget.id === id);
    setNewBudget({
      description: budgetToEdit.description,
      category_id: budgetToEdit.category_id,
      amount: budgetToEdit.amount,
    });
    setSelectedCategory(budgetToEdit.category_id);
    setEditId(id);
    setIsEditing(true);
    setFormVisible(true);
  }

  async function saveEditBudget() {
    if (
      !newBudget.description ||
      !newBudget.category_id ||
      newBudget.amount == null
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      console.log("Atualizando orçamento:", newBudget); // Verificar dados antes de enviar
      await updateBudget(editId, newBudget);
      setNewBudget({ description: "", category_id: "", amount: "" });
      setSelectedCategory("");
      setIsEditing(false);
      setEditId(null);
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  async function delBudget(id) {
    try {
      await deleteBudget(id);
      const response = await getAllBudgets();
      setBudgets(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!formVisible);
    setNewBudget({ description: "", category_id: "", amount: "" });
    setSelectedCategory("");
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.divBtnAdd}>
        <h2>Orçamentos</h2>
        <button className={styles.btnAdd} onClick={toggleFormVisibility}>
          {formVisible ? "Fechar" : "Adicionar Orçamento"}
        </button>
      </div>
      {formVisible && (
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Orçamento" : "Adicionar Orçamento"}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>Descrição:</label>
              <input
                type="text"
                name="description"
                value={newBudget.description}
                onChange={handleInputChange}
              />
              <label>Limite (R$):</label>
              <input
                type="number"
                name="amount"
                value={newBudget.amount}
                onChange={handleInputChange}
              />
              <label>Categoria:</label>
              <Select
                options={categories}
                name="category_id"
                value={selectedCategory}
                onChange={handleSelectChange} 
              />
              <button
                className={styles.btnSave}
                onClick={isEditing ? saveEditBudget : addBudget}
              >
                {isEditing ? "Salvar Alterações" : "Adicionar Orçamento"}
              </button>
            </form>
          </div>
        </div>
      )}
      <div className={styles.budgetsContainer}>
        <h2>Meus Orçamentos</h2>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Limite</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => {
              const status = budgetAlerts[budget.id];
              let rowClass;

              if (status === "alert") {
                rowClass = styles.overBudget; // Vermelho para orçamento excedido
              } else if (status === "warning") {
                rowClass = styles.warningBudget; // Amarelo para 90% do limite
              } else {
                rowClass = styles.normalBudget; // Padrão para dentro do limite
              }

              return (
                <tr key={budget.id} className={rowClass}>
                  <td>
                    {categories.find((cat) => cat.value === budget.category_id)
                      ?.label || "Categoria não encontrada"}
                  </td>
                  <td>R$ {budget.amount}</td>
                  <td>
                    <button
                      className={styles.btnBudgets}
                      onClick={() => editBudget(budget.id)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnBudgets}
                      onClick={() => delBudget(budget.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Budgets;
