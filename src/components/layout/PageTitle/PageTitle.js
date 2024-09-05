import React from "react";
import styles from "./PageTitle.module.css";

function PageTitle({title}) {
    return (
        <div className={`${styles.pageTitle}`}>
            <h1>{title}</h1>
        </div>
    )
}

export default PageTitle;