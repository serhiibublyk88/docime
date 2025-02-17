import styles from "./HomePage.module.css";

export const HomePage = () => {
  return (
    <div className="main-content">
      <h3>
        Der Test ist vorübergehend, aber das Wissen bleibt ewig{" "}
        <span className={`${styles.dots} fw-bold`}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </h3>
    </div>
  );
};
