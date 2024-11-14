import React, { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar/NavBar";
import styles from "./Expense.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  // Estado para armazenar categorias dinâmicas
  const [categories, setCategories] = useState([]);

  async function getCategories() {
    try {
      const response = await getCategoryByType("expense");
      const formattedCategories = response.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));

      setCategories([
        { value: "", label: "Selecione a categoria" },
        ...formattedCategories,
      ]);
    } catch (error) {
      console.log("Erro ao buscar categorias:", error);
    }
  }

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

  // Função para lidar com inputs de texto
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  }

  // Função para lidar com a seleção de categoria
  function handleSelectChange(value) {
    setSelectedCategory(value); // Atualiza `selectedCategory`
    setNewExpense({ ...newExpense, category_id: value }); // Atualiza `category_id` em `newExpense`
  }

  async function addExpense() {
    if (
      !newExpense.description ||
      !newExpense.amount ||
      !newExpense.date ||
      !newExpense.category_id
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createExpense(newExpense);
      const response = await getAllExpenses(); // Atualiza a lista de despesas
      setExpense(Array.isArray(response) ? response : []);
      setNewExpense({ description: "", amount: "", date: "", category_id: "" });
      setSelectedCategory("");
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
    }
  }

  async function delExpense(id) {
    try {
      await deleteExpense(id);
      const response = await getAllExpenses(); // Atualiza a lista de despesas
      setExpense(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  }

  function editExpense(id) {
    const expenseToEdit = expense.find((expense) => expense.id === id);
    setNewExpense(expenseToEdit);
    setSelectedCategory(expenseToEdit.category_id); // Define a categoria selecionada
    setIsEditing(true);
    setEditId(id);
    setFormVisible(true);
  }

  async function saveEditExpense() {
    try {
      await updateExpense(editId, newExpense);
      const response = await getAllExpenses(); // Atualiza a lista de despesas
      setExpense(response);
      setNewExpense({ description: "", amount: "", date: "", category_id: "" });
      setIsEditing(false);
      setEditId(null);
      console.log(newExpense);
      setSelectedCategory("");
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
    <div className={styles.container}>
      <NavBar />
      {formVisible && (
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Despesa" : "Adicionar Despesa"}</h3>
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
            <div className={styles.categoryDate}>
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
                onChange={handleSelectChange} // Passa `handleSelectChange` para o `Select`
                name="category_id"
              />
            </div>
            <button
              className={styles.btnExpense}
              onClick={isEditing ? saveEditExpense : addExpense}
            >
              {isEditing ? "Salvar alterações" : "Adicionar Despesa"}
            </button>
          </div>
        </div>
      )}
      <div className={styles.expenseContainer}>
        <div className={styles.divBtnAdd}>
          <h2>Minhas Despesas</h2>
          <button className={styles.btnAdd} onClick={toggleFormVisibility}>
            Adicionar Despesa <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className={styles.divTable}>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {expense.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>R$ -{expense.amount}</td>
                  <td>{expense.date}</td>
                  <td>
                    <button
                      className={styles.btnExpense}
                      onClick={() => editExpense(expense.id)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnExpense}
                      onClick={() => delExpense(expense.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Expense;
