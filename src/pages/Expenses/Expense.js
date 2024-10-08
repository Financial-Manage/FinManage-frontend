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
  });

  //tirar dps
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedCategory, setSelectCategory] = useState("");

  // estado para armazenar categorias dinâmicas
  const [categories, setCategories] = useState([
    { value: "", label: "Selecione a categoria" }, // Categoria default
  ]);

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
      console.log("Erro ao buscar receitas:", error);
    }
  }

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await getAllExpenses();
        setExpense(Array.isArray(response)? response : []);
      } catch (error) {
        console.log("Erro ao obter despesas", error);
      }
    }
    fetchExpenses();
    getCategories();
  }, []);

  async function addExpense() {
    if (
      !newExpense.description ||
      !newExpense.amount ||
      !newExpense.date ||
      !selectedCategory
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createExpense(newExpense);
      const response = await getAllExpenses(); // atualiza a lista de despesas
      setExpense(response);
      setNewExpense({ description: "", amount: "", date: "" });
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
    }
  }

  async function delExpense(id) {
    try {
      await deleteExpense(id);
      const response = await getAllExpenses(); //atualiza a lista
      setExpense(response);
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
    }
  }

  function editExpense(id) {
    const expenseToEdit = expense.find((expense) => expense.id === id);
    setNewExpense(expenseToEdit); //passa para newExpense a despesa a ser editada
    setIsEditing(true);
    setEditId(id); //passa para editId o id da despesa
    setFormVisible(true);
  }

  async function saveEditExpense() {
    try {
      await updateExpense(editId, newExpense);
      const response = await getAllExpenses();
      setExpense(response);
      setNewExpense({ description: "", amount: "", date: "" });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  function handleSelectChange(event) {
    setSelectCategory(event.target.value);
  }

  function toggleFormVisibiity() {
    setFormVisible(!formVisible); //altera a visibilidade atual para o inverso
    setNewExpense({ description: "", amount: "", date: "" });
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div className={styles.container}>
      <NavBar />
      {/*form para add/editar receitas*/}
      {formVisible && (
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Despesa" : "Adicionar Despesa"}</h3>
            <label htmlFor="description">Descrição:</label>
            <input
              type="text"
              placeholder="Descrição"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />
            <label htmlFor="amount">Valor:</label>
            <input
              type="number"
              placeholder="Valor"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <div className={styles.categoryDate}>
              <label htmlFor="date">Data de vencimento:</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
              />
              <label htmlFor="category">Categoria:</label>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={handleSelectChange}
                name="dynamicSelect"
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
          <button className={styles.btnAdd} onClick={toggleFormVisibiity}>
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
