import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Balance from "../../components/Balance/Balance";
import Container from "../../components/layout/Container/Container";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import Select from "../../components/layout/Select/Select";
import NavBar from "../../components/layout/NavBar/NavBar";

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("");
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
        <Balance title={"Saldo:"} balance={1000} />
        <Balance title={"Receitas:"} balance={1000} icon={faPlus} />
        <Balance title={"Despesas:"} balance={1000} icon={faPlus} />
      </Container>
    </div>
  );
}

export default Dashboard;
