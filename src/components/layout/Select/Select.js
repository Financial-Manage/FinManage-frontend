import React from "react";
import styles from "./Select.module.css";

function Select({ options, label, onChange, value, name }) {
  // evita erros com `undefined` no `event`
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue); // Chama o onChange com o valor selecionado
  };

  return (
    <div className={styles.selectContainer}>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        className={styles.imobBoxTipo}
        id={name}
        name={name}
        value={value || ""} // garante value como string
        onChange={handleChange}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;