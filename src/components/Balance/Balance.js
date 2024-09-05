import React from "react";
import styles from "../styles/Balance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Balance({ balance, title, icon }) {
  return (
    <div className="balance-container">
      <div className="content">
        <h4>{title}</h4>
        <div className="amount">
          <h2>R$ {balance} </h2> 
          {icon && <button><FontAwesomeIcon icon={icon} /></button>}
        </div>
      </div>
    </div>
  );
}

export default Balance;
