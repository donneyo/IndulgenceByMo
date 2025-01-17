import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../../styles/Product.module.css"; // Adjust to your stylesheet path

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../../styles/Product.module.css"; // Adjust to your stylesheet path

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
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
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.title || !product.prices[0] || !product.img) {
      alert("All fields are required!");
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
          title: product.title,
          prices: [parseFloat(product.prices[0])], // Ensure price is a number
          img: product.img,
        }
      );
      alert("Product updated successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

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
            value={product.title || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="prices"
            type="number"
            value={product.prices?.[0] || ""}
            onChange={(e) => handleChange({ ...e, name: "prices", value: [e.target.value] })}
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
            value={product.img || ""}
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

  const [product, setProduct] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch product by ID
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/products/${id}`);
          setProduct(res.data);
          setTitle(res.data.title);
          setPrice(res.data.prices[0]); // Assuming prices is an array
          setImg(res.data.img);
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/products/${id}`, {
        title,
        prices: [price], // Assuming it's a single price
        img,
      });
      router.push("/admin"); // Redirect back to the admin page after editing
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Image URL</label>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
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
