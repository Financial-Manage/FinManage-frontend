import React from "react";
import styles from "./Select.module.css";

function Select({options, label, onChange, value, name}) {
    return (
        <div className={styles.selectContainer}>
            {label && <label htmlFor={name}>{label}</label>}
            <select 
                className={styles.imobBoxTipo} 
                id={name} 
                name={name} 
                value={value} 
                onChange={onChange}>

                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Select;