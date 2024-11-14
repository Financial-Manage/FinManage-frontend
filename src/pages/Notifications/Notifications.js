import NavBar from "../../components/layout/NavBar/NavBar";
import React, { useState } from "react";
import styles from "./Notifications.module.css";

function Notifications() {
  // Simulação de dados de notificação
  const [notifications, setNotifications] = useState([
    { id: 1, type: "alert", message: "Orçamento ultrapassado!", read: false },
    { id: 2, type: "warning", message: "Orçamento atingiu 90%!", read: false },
    { id: 3, type: "info", message: "Nova categoria adicionada.", read: true },
  ]);

  // Função para marcar como lida
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>
            <i className="fa-solid fa-bell"></i> Notificações
          </h2>
        </header>

        {/* Filtro de Notificações */}
        <div className={styles.filters}>
          <button className={styles.filterButton}>Todas</button>
          <button className={styles.filterButton}>Não Lidas</button>
          <button className={styles.filterButton}>Alertas</button>
        </div>

        {/* Lista de Notificações */}
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${
                styles[notification.type]
              } ${notification.read ? styles.read : ""}`}
            >
              <i
                className={
                  notification.type === "alert"
                    ? "fa-solid fa-exclamation-circle"
                    : notification.type === "warning"
                    ? "fa-solid fa-exclamation-triangle"
                    : "fa-solid fa-info-circle"
                }
              ></i>
              <span>{notification.message}</span>
              {!notification.read && (
                <button
                  className={styles.markReadButton}
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar como lida
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
