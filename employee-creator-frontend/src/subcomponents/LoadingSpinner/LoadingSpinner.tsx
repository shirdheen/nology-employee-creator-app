import React from "react";
import styles from "./LoadingSpinner.module.scss";

// SOURCE: https://loading.io/css/

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
    >
      <div className={styles.ldsFacebook}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
