import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const Product = ({ bread }) => {
  const [price, setPrice] = useState(bread.prices[0]);
  const [size, setSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const dispatch = useDispatch();

  const changePrice = (number) => {
    setPrice(price + number);
  };

  const handleSize = (sizeIndex) => {
    const difference = bread.prices[sizeIndex] - bread.prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };

  const handleChange = (e, option) => {
    const checked = e.target.checked;
    if (checked) {
      changePrice(option.price);
      setExtras((prev) => [...prev, option]);
    } else {
      changePrice(-option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };

  const handleClick = () => {
    dispatch(
      addProduct({
        ...bread,
        extras: extras || [],
        price,
        quantity: quantity || 1,
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={bread.img} objectFit="contain" layout="fill" alt={bread.title} />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{bread.title}</h1>
        <span className={styles.price}>₦{price}</span>
        <p className={styles.desc}>{bread.desc}</p>
        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          {["Small", "Medium", "Large"].map((label, index) => (
            <div className={styles.size} key={index} onClick={() => handleSize(index)}>
              <Image src="/img/size.png" width={30} height={30} alt={label} />
              <span className={styles.number}>{label}</span>
            </div>
          ))}
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {bread.extraOptions.map((option) => (
            <div className={styles.option} key={option._id}>
              <input
                type="checkbox"
                id={option._id}
                name={option.text}
                className={styles.checkbox}
                onChange={(e) => handleChange(e, option)}
              />
              <label htmlFor={option._id}>{option.text}</label>
            </div>
          ))}
        </div>
        <div className={styles.add}>
          <input
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            type="number"
            value={quantity}
            className={styles.quantity}
            aria-label="Quantity"
          />
          <button className={styles.button} onClick={handleClick} aria-label="Add product to cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${params.id}`);
    return {
      props: {
        bread: res.data,
      },
    };
  } catch (err) {
    console.error("Error fetching product:", err);
    return {
      notFound: true,
    };
  }
};

export default Product;
