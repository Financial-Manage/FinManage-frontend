import React, { useState, useEffect } from "react";
import { useLocation as useReactRouterLocation } from "react-router-dom";
import styles from "./Categories.module.css";
import NavBar from "../../components/layout/NavBar/NavBar";
import Select from "../../components/layout/Select/Select";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from "../../services/categoriesRoutes";

function Categories() {
  const location = useReactRouterLocation();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    type: "",
    users_id: 10,
    isRecurring: false,
  });
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const typeOptions = [
    { value: "income", label: "Receita" },
    { value: "expense", label: "Despesa" },
  ];

  useEffect(() => {
    if (location.state?.showForm) {
      setFormVisible(true);
    }
  }, [location.state]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }
    fetchCategories();
  }, []);

  async function addCategory() {
    if (!newCategory.name || !newCategory.description || !newCategory.type) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createCategory(newCategory);
      const response = await getAllCategories();
      setCategories(Array.isArray(response) ? response : []);
      setNewCategory({
        name: "",
        description: "",
        type: "",
        users_id: 10,
        isRecurring: false,
      });
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  }

  function editCategory(id) {
    const categoryToEdit = categories.find((category) => category.id === id);
    setNewCategory(categoryToEdit);
    setEditId(id);
    setFormVisible(true);
  }

  async function saveEditCategory() {
    try {
      await updateCategory(editId, newCategory);
      const response = await getAllCategories();
      setCategories(response);
      setNewCategory({
        name: "",
        description: "",
        type: "",
        users_id: 10,
        isRecurring: false,
      });
      setEditId(null);
      setFormVisible(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  async function delCategory(id) {
    try {
      await deleteCategory(id);
      const response = await getAllCategories();
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!formVisible);
    setNewCategory({
      name: "",
      description: "",
      type: "",
      users_id: 10,
      isRecurring: false,
    });
    setEditId(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  }

  function handleSelectChange(value) {
    setNewCategory({ ...newCategory, type: value });
  }

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>Categorias</h2>
          <button className={styles.btnAdd} onClick={toggleFormVisibility}>
            {formVisible ? "Fechar" : "Adicionar Categoria"}
          </button>
        </div>

        {formVisible && (
          <div className={styles.formContainer}>
            <h3>{editId ? "Editar Categoria" : "Adicionar Categoria"}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="description">Descrição:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                required
              />
              <label>Tipo:</label>
              <Select
                options={typeOptions}
                name="type"
                value={newCategory.type}
                onChange={handleSelectChange}
              />
              <button
                className={styles.btnSave}
                onClick={editId ? saveEditCategory : addCategory}
              >
                {editId ? "Salvar Alterações" : "Adicionar Categoria"}
              </button>
            </form>
          </div>
        )}

        <div className={styles.categoriesList}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryCard}>
              <i className="fa-solid fa-folder"></i>
              <div className={styles.categoryDetails}>
                <h4>{category.name}</h4>
                <p>{category.description}</p>
                <span className={styles.categoryType}>
                  {category.type === "income" ? "Receita" : "Despesa"}
                </span>
              </div>
              <div className={styles.categoryActions}>
                <button
                  className={styles.btnCategories}
                  onClick={() => editCategory(category.id)}
                >
                  Editar
                </button>
                <button
                  className={styles.btnCategories}
                  onClick={() => delCategory(category.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
