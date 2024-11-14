import React, { useEffect, useState } from "react";
import NavBar from "../../components/layout/NavBar/NavBar";
import styles from "./Income.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  // Estado para armazenar categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState("");

  // Estado para armazenar categorias dinâmicas
  const [categories, setCategories] = useState([]);

  async function getCategories() {
    try {
      const response = await getCategoryByType("income");
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

  // Função para lidar com inputs de texto
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewIncome({ ...newIncome, [name]: value });
  }

  // Função para lidar com a seleção de categoria
  function handleSelectChange(value) {
    setSelectedCategory(value); // Atualiza `selectedCategory` com o valor selecionado
    setNewIncome({ ...newIncome, category_id: value }); // Define `category_id` no `newIncome`
  }

  async function addIncome() {
    if (
      !newIncome.description ||
      !newIncome.amount ||
      !newIncome.date ||
      !newIncome.category_id
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createIncome(newIncome);
      const response = await getAllIncomes(); // Atualiza a lista de receitas
      setIncome(Array.isArray(response) ? response : []);
      setNewIncome({ description: "", amount: "", date: "", category_id: "" });
    } catch (error) {
      console.error("Erro ao adicionar receita:", error);
    }
  }

  async function delIncome(id) {
    try {
      await deleteIncome(id);
      const response = await getAllIncomes(); // Atualiza a lista de receitas
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
      const response = await getAllIncomes(); // Atualiza a lista de receitas
      setIncome(response);
      setNewIncome({ description: "", amount: "", date: "", category_id: "" });
      setIsEditing(false);
      setEditId(null);
      setSelectedCategory("");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!formVisible); // Alterna a visibilidade do formulário
    setNewIncome({ description: "", amount: "", date: "", category_id: "" });
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div className={styles.container}>
      <NavBar />
      {formVisible && (
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Receita" : "Adicionar Receita"}</h3>
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
            <div className={styles.categoryDate}>
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
                onChange={handleSelectChange} // Passa a função `handleSelectChange`
                name="category_id"
              />
            </div>
            <button
              className={styles.btnIncome}
              onClick={isEditing ? saveEditIncome : addIncome}
            >
              {isEditing ? "Salvar alterações" : "Adicionar receita"}
            </button>
          </div>
        </div>
      )}
      <div className={styles.incomeContainer}>
        <div className={styles.divBtnAdd}>
          <h2>Minhas Receitas</h2>
          <button className={styles.btnAdd} onClick={toggleFormVisibility}>
            Adicionar Receita <FontAwesomeIcon icon={faPlus} />
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
              {income.map((income) => (
                <tr key={income.id}>
                  <td>{income.description}</td>
                  <td>R$ {income.amount}</td>
                  <td>{income.date}</td>
                  <td>
                    <button
                      className={styles.btnIncome}
                      onClick={() => editIncome(income.id)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnIncome}
                      onClick={() => delIncome(income.id)}
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

export default Income;
