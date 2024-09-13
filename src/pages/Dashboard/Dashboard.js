import { useEffect, useState } from "react";
import Balance from "../../components/Balance/Balance";
import Container from "../../components/layout/Container/Container";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import Select from "../../components/layout/Select/Select";
import NavBar from "../../components/layout/NavBar/NavBar";
import { getAllIncomes } from "../../services/api";
import { getAllExpenses } from "../../services/expenseRoutes";

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
        }, 0)
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
        }, 0)
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



  return (
    <div className="dashboard-container">
      <NavBar />
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
        name="dynamicSelect"
      />
      <PageTitle title={"Dashboard"} />
      <Container>
        <Balance title={"Saldo:"} balance={totalBalance} />
        <Balance title={"Receitas:"} balance={incomesTotal} icon={faPlus} />
        <Balance title={"Despesas:"} balance={expensesTotal} icon={faPlus} />
      </Container>
    </div>
  );
}

export default Dashboard;
