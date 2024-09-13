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

function Income() {
  // estado para armazenar receitas
  const [income, setIncome] = useState([]);

  // estado para armazenar nova receita
  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const response = await getAllIncomes();
        setIncome(response);
      } catch (error) {
        console.log("Erro ao buscar receitas:", error);
      }
    }
    fetchIncomes();
  }, []);

  async function addIncome() {
    try {
      await createIncome(newIncome);
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

  return (
    <div className={styles.container}>
      <NavBar />
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

        {/*form para add/editar receitas*/}

        {formVisible && (
          <div className={styles.main}>
            <div className={styles.formContainer}>
              <h3>{isEditing ? "Editar Receita" : "Adicionar Receita"}</h3>
              <input
                type="text"
                placeholder="Descrição"
                value={newIncome.description}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Valor"
                value={newIncome.amount}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, amount: e.target.value })
                }
              />
              <input
                type="date"
                value={newIncome.date}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, date: e.target.value })
                }
              />
              <button
                className={styles.btnIncome}
                onClick={isEditing ? saveEditIncome : addIncome}
              >
                {isEditing ? "Salvar alterações" : "Adicionar receita"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Income;
