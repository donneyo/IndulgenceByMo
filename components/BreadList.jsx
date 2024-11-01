import styles from "../styles/BreadList.module.css";
import BreadCard from "./BreadCard";

const BreadList = ({ breadList }) => {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>THE BEST CAKE BREAD IN TOWN</h1>
        <p className={styles.desc}>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit arcu
               in pretium molestie. Interdum et malesuada fames acme. Lorem ipsum dolor
               sit amet, consectetur adipiscing elit.
        </p>


        <div className={styles.wrapper}>
          {breadList && Array.isArray(breadList) && breadList.length > 0 ? (
            breadList.map((cakebread) => (
              <BreadCard key={cakebread._id} cakebread={cakebread} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BreadList;
