import React from "react";
import styles from "./Balance.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Balance({ balance, title, icon, clss }) {
  return (
    <div className={styles[clss]}>
      <div className={styles.content}>
        <h4>{title}</h4>
        <div className={styles.amount}>
          <h2>R$ {balance}</h2>
          {icon && <button className={styles.iconButton}><FontAwesomeIcon icon={icon} /></button>}
        </div>
      </div>
    </div>
  );
}

export default Balance;
