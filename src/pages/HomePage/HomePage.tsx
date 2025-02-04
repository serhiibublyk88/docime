import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.message}>
        Der Test ist vorübergehend, aber das Wissen bleibt ewig{" "}
        <span className={styles.dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </h3>
    </div>
  );
};

export default HomePage;
