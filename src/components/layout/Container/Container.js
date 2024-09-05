import styles from '../Container/Container.module.css';

function Container({customClass, children}) {
    return (
        <div className={`${styles.container} ${styles[customClass]}`}>
            {children}
        </div>
    )
}

export default Container;