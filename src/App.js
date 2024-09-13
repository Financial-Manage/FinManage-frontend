import React from "react";
import {Route, Routes,} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Income from "./pages/Income/Income";
import Expense from "./pages/Expenses/Expense";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Dashboard/>} /> {/*rota para dashboard*/}
        <Route path="/receitas" element={<Income/>} />
        <Route path="/despesas" element={<Expense/>} />
        {/*rota para receitas/income*/}
      </Routes>
  );
}

export default App;
