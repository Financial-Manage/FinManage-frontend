import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Income from "./pages/Income/Income";
import Expense from "./pages/Expenses/Expense";
import Categories from "./pages/Categories/Categories";
import Budgets from "./pages/Budgets/Budgets";
import Notifications from "./pages/Notifications/Notifications";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* rotas publicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* rotas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/receitas"
        element={
          <PrivateRoute>
            <Income />
          </PrivateRoute>
        }
      />
      <Route
        path="/despesas"
        element={
          <PrivateRoute>
            <Expense />
          </PrivateRoute>
        }
      />
      <Route
        path="/categorias"
        element={
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        }
      />
      <Route
        path="/orcamento"
        element={
          <PrivateRoute>
            <Budgets />
          </PrivateRoute>
        }
      />
      <Route
        path="/notificacoes"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
