import React from 'react';
import styles from "./Header.module.css";

function Header({title}) {
    return (
        <div className={`${styles.headerContainer}`}>
            <h2>{title}</h2>
        </div>
    );
}

export default Header;