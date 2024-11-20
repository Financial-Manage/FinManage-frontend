import React, { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar/NavBar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Expense.module.css";
import Select from "../../components/layout/Select/Select";
import { getCategoryByType } from "../../services/categoriesRoutes";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getAllExpenses,
} from "../../services/expenseRoutes";

function Expense() {
  const [expense, setExpense] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await getAllExpenses();
        setExpense(Array.isArray(response) ? response : []);
      } catch (error) {
        console.log("Erro ao obter despesas", error);
      }
    }
    fetchExpenses();
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await getCategoryByType("expense");
      const formattedCategories = response.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));
      setCategories([{ value: "", label: "Selecione a categoria" }, ...formattedCategories]);
    } catch (error) {
      console.log("Erro ao buscar categorias:", error);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  }

  function handleSelectChange(value) {
    setSelectedCategory(value);
    setNewExpense({ ...newExpense, category_id: value });
  }

  async function addExpense() {
    if (!newExpense.description || !newExpense.amount || !newExpense.date || !newExpense.category_id) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createExpense(newExpense);
      const response = await getAllExpenses();
      setExpense(Array.isArray(response) ? response : []);
      setNewExpense({ description: "", amount: "", date: "", category_id: "" });
      setSelectedCategory("");
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
    }
  }

  async function delExpense(id) {
    try {
      await deleteExpense(id);
      const response = await getAllExpenses();
      setExpense(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  }

  function editExpense(id) {
    const expenseToEdit = expense.find((expense) => expense.id === id);
    setNewExpense(expenseToEdit);
    setSelectedCategory(expenseToEdit.category_id);
    setIsEditing(true);
    setEditId(id);
    setFormVisible(true);
  }

  async function saveEditExpense() {
    try {
      await updateExpense(editId, newExpense);
      const response = await getAllExpenses();
      setExpense(response);
      setNewExpense({ description: "", amount: "", date: "", category_id: "" });
      setIsEditing(false);
      setEditId(null);
      setSelectedCategory("");
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!formVisible);
    setNewExpense({ description: "", amount: "", date: "", category_id: "" });
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>Minhas Despesas</h2>
          <button className={styles.btnAdd} onClick={toggleFormVisibility}>
            Adicionar Despesa <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {formVisible && (
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Despesa" : "Adicionar Despesa"}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="description">Descrição:</label>
              <input
                type="text"
                placeholder="Descrição"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
              />
              <label htmlFor="amount">Valor:</label>
              <input
                type="number"
                placeholder="Valor"
                name="amount"
                value={newExpense.amount}
                onChange={handleInputChange}
              />
              <label htmlFor="date">Data de vencimento:</label>
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleInputChange}
              />
              <label htmlFor="category">Categoria:</label>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={handleSelectChange}
                name="category_id"
              />
              <button
                className={styles.btnSave}
                onClick={isEditing ? saveEditExpense : addExpense}
              >
                {isEditing ? "Salvar Alterações" : "Adicionar Despesa"}
              </button>
            </form>
          </div>
        )}

        <div className={styles.expenseList}>
          {expense.map((expenseItem) => (
            <div key={expenseItem.id} className={styles.expenseCard}>
              <i className="fa-solid fa-money-bill-wave"></i>
              <div className={styles.expenseDetails}>
                <h4>{expenseItem.description}</h4>
                <p>R$ {expenseItem.amount}</p>
                <p>Data: {expenseItem.date}</p>
              </div>
              <div className={styles.expenseActions}>
                <button className={styles.btnExpense} onClick={() => editExpense(expenseItem.id)}>
                  Editar
                </button>
                <button className={styles.btnExpense} onClick={() => delExpense(expenseItem.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Expense;
