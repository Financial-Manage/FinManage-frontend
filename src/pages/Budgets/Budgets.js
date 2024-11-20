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
          alerts[budget.id] = alertResponse.status;
        }
        setBudgetAlerts(alerts);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchData();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  }

  function handleSelectChange(value) {
    setSelectedCategory(value);
    setNewBudget({ ...newBudget, category_id: value });
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
      setSelectedCategory("");
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
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>Orçamentos</h2>
          <button className={styles.btnAdd} onClick={toggleFormVisibility}>
            {formVisible ? "Fechar" : "Adicionar Orçamento"}
          </button>
        </div>

        {formVisible && (
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
        )}

        <div className={styles.budgetsList}>
          {budgets.map((budget) => {
            const status = budgetAlerts[budget.id];
            let cardClass;

            if (status === "alert") {
              cardClass = styles.overBudget;
            } else if (status === "warning") {
              cardClass = styles.warningBudget;
            } else {
              cardClass = styles.normalBudget;
            }

            return (
              <div
                key={budget.id}
                className={`${styles.budgetCard} ${cardClass}`}
              >
                <i className="fa-solid fa-wallet"></i>
                <div className={styles.budgetDetails}>
                  <h4>
                    {categories.find((cat) => cat.value === budget.category_id)
                      ?.label || "Categoria não encontrada"}
                  </h4>
                  <p>Limite: R$ {budget.amount}</p>
                </div>
                <div className={styles.budgetActions}>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Budgets;
