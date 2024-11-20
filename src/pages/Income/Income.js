import React, { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./Income.module.css";
import {
  createIncome,
  updateIncome,
  deleteIncome,
  getAllIncomes,
} from "../../services/api";
import Select from "../../components/layout/Select/Select";
import { getCategoryByType } from "../../services/categoriesRoutes";

function Income() {
  const [income, setIncome] = useState([]);
  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const response = await getAllIncomes();
        setIncome(Array.isArray(response) ? response : []);
      } catch (error) {
        console.log("Erro ao buscar receitas:", error);
      }
    }
    fetchIncomes();
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await getCategoryByType("income");
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
    setNewIncome({ ...newIncome, [name]: value });
  }

  function handleSelectChange(value) {
    setSelectedCategory(value);
    setNewIncome({ ...newIncome, category_id: value });
  }

  async function addIncome() {
    if (!newIncome.description || !newIncome.amount || !newIncome.date || !newIncome.category_id) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createIncome(newIncome);
      const response = await getAllIncomes();
      setIncome(Array.isArray(response) ? response : []);
      setNewIncome({ description: "", amount: "", date: "", category_id: "" });
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar receita:", error);
    }
  }

  async function delIncome(id) {
    try {
      await deleteIncome(id);
      const response = await getAllIncomes();
      setIncome(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
    }
  }

  function editIncome(id) {
    const incomeToEdit = income.find((income) => income.id === id);
    setNewIncome(incomeToEdit);
    setSelectedCategory(incomeToEdit.category_id);
    setIsEditing(true);
    setEditId(id);
    setFormVisible(true);
  }

  async function saveEditIncome() {
    try {
      await updateIncome(editId, newIncome);
      const response = await getAllIncomes();
      setIncome(response);
      setNewIncome({ description: "", amount: "", date: "", category_id: "" });
      setIsEditing(false);
      setEditId(null);
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!formVisible);
    setNewIncome({ description: "", amount: "", date: "", category_id: "" });
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>Minhas Receitas</h2>
          <button className={styles.btnAdd} onClick={toggleFormVisibility}>
            Adicionar Receita <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {formVisible && (
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Receita" : "Adicionar Receita"}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="description">Descrição:</label>
              <input
                type="text"
                placeholder="Descrição"
                name="description"
                value={newIncome.description}
                onChange={handleInputChange}
              />
              <label htmlFor="amount">Valor:</label>
              <input
                type="number"
                placeholder="Valor"
                name="amount"
                value={newIncome.amount}
                onChange={handleInputChange}
              />
              <label htmlFor="date">Data de entrada:</label>
              <input
                type="date"
                name="date"
                value={newIncome.date}
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
                onClick={isEditing ? saveEditIncome : addIncome}
              >
                {isEditing ? "Salvar Alterações" : "Adicionar Receita"}
              </button>
            </form>
          </div>
        )}

        <div className={styles.incomeList}>
          {income.map((incomeItem) => (
            <div key={incomeItem.id} className={styles.incomeCard}>
              <i className="fa-solid fa-coins"></i>
              <div className={styles.incomeDetails}>
                <h4>{incomeItem.description}</h4>
                <p>R$ {incomeItem.amount}</p>
                <p>Data: {incomeItem.date}</p>
              </div>
              <div className={styles.incomeActions}>
                <button className={styles.btnIncome} onClick={() => editIncome(incomeItem.id)}>
                  Editar
                </button>
                <button className={styles.btnIncome} onClick={() => delIncome(incomeItem.id)}>
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

export default Income;
