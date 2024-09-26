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
  // estado para armazenar receitas
  const [income, setIncome] = useState([]);

  // estado para armazenar nova receita
  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: ""  // Adicionando o campo category_id
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  //estado para armazenar categoria selecionada
  const [selectedCategory, setSelectCategory] = useState("");

  // estado para armazenar categorias dinâmicas
  const [categories, setCategories] = useState([
    { value: "", label: "Selecione a categoria" }, // Categoria default
  ]);

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
      console.log("Erro ao buscar receitas:", error);
    }
  }

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const response = await getAllIncomes();
        setIncome(Array.isArray(response)? response : []);
      } catch (error) {
        console.log("Erro ao buscar receitas:", error);
      }
    }
    fetchIncomes();
    getCategories();
  }, []);

  async function addIncome() {
    if (
      !newIncome.description ||
      !newIncome.amount ||
      !newIncome.date ||
      !selectedCategory
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const incomeToAdd = { ...newIncome, category_id: selectedCategory };
    try {
      await createIncome(incomeToAdd);
      const response = await getAllIncomes(); // atualiza a lista de receitas
      setIncome(response);
      setNewIncome({ description: "", amount: "", date: "" });
    } catch (error) {
      console.error("Erro ao adicionar receita:", error);
    }
  }

  async function delIncome(id) {
    try {
      await deleteIncome(id);
      const response = await getAllIncomes(); // atualiza a lista de receitas
      setIncome(response);
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
    }
  }

  function editIncome(id) {
    const incomeToEdit = income.find((income) => income.id === id);
    setNewIncome(incomeToEdit);
    setIsEditing(true);
    setEditId(id);
    setFormVisible(true);
  }

  async function saveEditIncome() {
    try {
      await updateIncome(editId, newIncome);
      const response = await getAllIncomes(); // atualiza a lista de receitas
      setIncome(response);
      setNewIncome({ description: "", amount: "", date: "" });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  function toggleFormVisibiity() {
    setFormVisible(!formVisible); //altera a visibilidade atual para o inverso
    setNewIncome({ description: "", amount: "", date: "" });
    setIsEditing(false);
    setEditId(null);
  }

  //captura a opção selecionada e armazena no estado de cagtegory
  function handleSelectChange(event) {
    const selectedValue = event.target.value; 
    setSelectCategory(selectedValue);          // Atualiza o estado com o valor selecionado
  }


  return (
    <div className={styles.container}>
      <NavBar />
      {/*form para add/editar receitas*/}

      {formVisible && (
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <h3>{isEditing ? "Editar Receita" : "Adicionar Receita"}</h3>
            <label htmlFor="description">Descrição:</label>
            <input
              type="text"
              placeholder="Descrição"
              value={newIncome.description}
              onChange={(e) =>
                setNewIncome({ ...newIncome, description: e.target.value })
              }
            />
            <label htmlFor="amount">Valor:</label>
            <input
              type="number"
              placeholder="Valor"
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: e.target.value })
              }
            />
            <div className={styles.categoryDate}>
              <label htmlFor="date">Data de entrada:</label>
              <input
                type="date"
                value={newIncome.date}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, date: e.target.value })
                }
              />
              <label htmlFor="categorye">Categoria:</label>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={handleSelectChange}
                name="dynamicSelect"
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
          <button className={styles.btnAdd} onClick={toggleFormVisibiity}>
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
