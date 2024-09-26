import { useState, useEffect } from "react";
import { useLocation as useReactRouterLocation } from "react-router-dom";
import styles from "./Categories.module.css";
import NavBar from "../../components/layout/NavBar/NavBar";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByType,
} from "../../services/categoriesRoutes";
import Select from "../../components/layout/Select/Select";

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
  const type = [
    { value: "", label: "Selecione" },
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
    console.log(newCategory);
    if (!newCategory.name || !newCategory.description || !newCategory.type) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await createCategory(newCategory);
      const response = await getAllCategories(); // atualiza a lista de receitas
      setCategories(response);
      console.log(response);
      setNewCategory({
        name: "",
        description: "",
        type: "",
        users_id: 10,
        isRecurring: false,
      });
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
      const response = await getAllCategories(); // atualiza a lista de receitas
      setCategories(response);
      setNewCategory({
        name: "",
        description: "",
        type: "",
        users_id: 10,
        isRecurring: false,
      });
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  }

  async function delCategory(id) {
    try {
      await deleteCategory(id);
      const response = await getAllCategories(); // atualiza a lista de receitas
      setCategories(response);
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

  //função para lidar com mudanças nos campos input e dropdown
  function handleChange(e) {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  }

  //alterna o valor de isRecurring quando o checkbox é marcado ou desmarcado
  function handleCheckBox() {
    setNewCategory((prevState) => ({
      ...prevState,
      isRecurring: !prevState.isRecurring,
    }));
  }

  function handleEditClick(category) {
    setNewCategory({
      name: category.name,
      description: category.description,
      type: category.type,
      users_id: category.users_id || 10,
      isRecurring: category.isRecurring,
    });
    setEditId(category.id);
    setFormVisible(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      saveEditCategory();
    } else {
      addCategory();
    }
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.divBtnAdd}>
        <h2>Categorias</h2>
        <button className={styles.btnAdd} onClick={toggleFormVisibility}>
          {formVisible ? "Fechar" : "Adicionar Categoria"}
        </button>
      </div>
      {formVisible && (
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <h3>{editId ? "Editar Categoria" : "Adicionar Categoria"}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Nome:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Descrição:</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  id="users_id"
                  name="users_id"
                  value={newCategory.users_id}
                  hidden
                  onChange={handleChange}
                  required
                />
              </div>
              <label>Tipo:</label>
              <div className={styles.divSelect}>
                <Select
                  options={type}
                  name="type"
                  value={newCategory.type} // Aqui agora é diretamente o valor do estado
                  onChange={handleChange} // Usamos a função handleChange para capturar o evento
                />
              </div>
              <div className={styles.divButton}>
                <button className={styles.btnCategories} type="submit">
                  {editId ? "Salvar alterações" : "Salvar categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.categoryContainer}>
        <div className={styles.myCategories}>
          <h2>Minhas Categorias</h2>
        </div>
        <div className={styles.divTable}>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>{category.type === "income" ? "Receita" : "Despesa"}</td>
                  <td>
                    <button
                      className={styles.btnCategories}
                      onClick={() => handleEditClick(category)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnCategories}
                      onClick={() => delCategory(category.id)}
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

export default Categories;
