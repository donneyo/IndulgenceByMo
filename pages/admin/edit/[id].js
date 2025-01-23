import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../../styles/Product.module.css"; // Adjust if needed

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState({
    title: "",
    prices: [""],
    img: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
          );
          setProduct(res.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Failed to fetch product. Please try again later.");
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "prices" ? [value] : value, // Ensure prices is an array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        product
      );
      alert("Product updated successfully!");
      router.push("/admin"); // Redirect to admin page
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="prices">Price</label>
          <input
            id="prices"
            name="prices"
            type="number"
            value={product.prices[0]}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="img">Image URL</label>
          <input
            id="img"
            name="img"
            type="text"
            value={product.img}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
