import { useEffect, useState } from "react";
import Balance from "../../components/Balance/Balance";
import Container from "../../components/layout/Container/Container";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import Select from "../../components/layout/Select/Select";
import NavBar from "../../components/layout/NavBar/NavBar";
import { getAllIncomes } from "../../services/api";
import { getAllExpenses } from "../../services/expenseRoutes";
import styles from "../Dashboard/Dashboard.module.css";
import { Link } from "react-router-dom";

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("");
  const [incomesTotal, setIncomesTotal] = useState(0);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    async function fetchTotalIncomes() {
      try {
        const response = await getAllIncomes();
        let totalIncomes = response.reduce((acc, income) => {
          return acc + parseFloat(income.amount); //percorre cada receita da consulta e acessa o valor de amount, acumulando na variavel totalAmount
        }, 0);
        setIncomesTotal(totalIncomes);
      } catch (error) {
        console.log("Erro ao buscar receitas:", error);
      }
    }
    fetchTotalIncomes();
  }, []);

  useEffect(() => {
    async function fetchTotalExpenses() {
      try {
        const response = await getAllExpenses();
        let totalExpenses = response.reduce((acc, income) => {
          return acc + parseFloat(income.amount);
        }, 0);
        setExpensesTotal(totalExpenses);
      } catch (error) {
        console.log("Erro ao buscar receitas:", error);
      }
    }
    fetchTotalExpenses();
  }, []);

  useEffect(() => {
    const total = incomesTotal - expensesTotal;
    setTotalBalance(total);
  }, [incomesTotal, expensesTotal]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const options = [
    { value: "", label: "Selecione o mês" },
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
  ];

  function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  return (
    <div className="dashboard-container">
      <div className={styles.divNavBar}>
        <NavBar />
      </div>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
        name="dynamicSelect"
      />
      <div className={styles.divDashBtnAdd}>
        <PageTitle title={"Dashboard"} />
        <Link to="/categorias" state={{ showForm: true }}>
          <button className={styles.btnAdd}>Cadastrar Categoria</button>
        </Link>
      </div>
      <Container>
        <Balance title={"Saldo:"} balance={formatCurrency(totalBalance)} 
        clss={"saldoContainer"} />
        <Balance
          title={"Receitas Previstas:"}
          balance={formatCurrency(incomesTotal)}
          icon={faPlus}
          clss={"receitasContainer"}
        />
        <Balance
          title={"Despesas Previstas:"}
          balance={formatCurrency(expensesTotal)}
          icon={faPlus}
          clss={"despesasContainer"}
        />
      </Container>
      {/* <div className={styles.divBtnAdd}>
        <button className={styles.btnAdd}>Adicionar Orçamento</button>
        <button className={styles.btnAdd}>Filtrar Transações</button>
      </div> */}
    </div>
  );
}

export default Dashboard;
