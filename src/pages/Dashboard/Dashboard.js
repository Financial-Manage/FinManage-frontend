import { useEffect, useState } from "react";
import Balance from "../../components/Balance/Balance";
import Select from "../../components/layout/Select/Select";
import NavBar from "../../components/layout/NavBar/NavBar";
import { getAllIncomes } from "../../services/api";
import { getAllExpenses } from "../../services/expenseRoutes";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("");
  const [incomesTotal, setIncomesTotal] = useState(0);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    async function fetchTotalIncomes() {
      try {
        const response = await getAllIncomes();
        const totalIncomes = response.reduce((acc, income) => acc + parseFloat(income.amount), 0);
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
        const totalExpenses = response.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        setExpensesTotal(totalExpenses);
      } catch (error) {
        console.log("Erro ao buscar despesas:", error);
      }
    }
    fetchTotalExpenses();
  }, []);

  useEffect(() => {
    setTotalBalance(incomesTotal - expensesTotal);
  }, [incomesTotal, expensesTotal]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const options = [
    { value: "", label: "Selecione o mês" },
    { value: "january", label: "Janeiro" },
    { value: "february", label: "Fevereiro" },
    { value: "march", label: "Março" },
    // Adicione mais opções conforme necessário
  ];

  const formatCurrency = (value) => value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  return (
    <div className={styles.dashboardContainer}>
      <NavBar />

      <div className={styles.dashboardContent}>
        <div className={styles.header}>
          <h2>Dashboard</h2>
          <Link to="/categorias" state={{ showForm: true }}>
            <button className={styles.btnAdd}>Cadastrar Categoria</button>
          </Link>
        </div>

        <div className={styles.balanceContainer}>
          <Balance
            title="Saldo"
            balance={formatCurrency(totalBalance)}
            clss="saldoContainer"
          />
          <Balance
            title="Receitas Previstas"
            balance={formatCurrency(incomesTotal)}
            icon={faPlus}
            clss="receitasContainer"
          />
          <Balance
            title="Despesas Previstas"
            balance={formatCurrency(expensesTotal)}
            icon={faPlus}
            clss="despesasContainer"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
