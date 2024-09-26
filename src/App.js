import React from "react";
import {Route, Routes,} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Income from "./pages/Income/Income";
import Expense from "./pages/Expenses/Expense";
import Categories from "./pages/Categories/Categories";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Dashboard/>} /> {/*rota para dashboard*/}
        <Route path="/receitas" element={<Income/>} />
        <Route path="/despesas" element={<Expense/>} />
        <Route path="/categorias" element={<Categories/>} />
      </Routes>
  );
}

export default App;
