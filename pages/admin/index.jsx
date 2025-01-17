import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Admin.module.css";

const Index = ({ orders, products }) => {
  const [BreadList, setBreadList] = useState(products || []);
  const [orderList, setOrderList] = useState(orders || []);
  const status = ["preparing", "on the way", "delivered", "Order Closed"];
  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const clearClosedOrders = async () => {
    try {
      const res = await axios.delete(`${apiBaseUrl}/api/orders/clearClosed`);
      alert(res.data.message);
      setOrderList(orderList.filter((order) => order.status !== 3));
    } catch (error) {
      console.error("Failed to delete closed orders:", error);
      alert("An error occurred while clearing closed orders.");
    }
  };

  const handleEdit = (id) => {
    if (id) {
      router.push(`/admin/edit/${id}`);
    } else {
      console.error("Product ID is undefined");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/products/${id}`);
      setBreadList((prev) => prev.filter((bread) => bread._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleStatus = async (id) => {
    try {
      const item = orderList.find((order) => order._id === id);
      if (!item) throw new Error("Order not found");

      const updatedOrder = { ...item, status: item.status + 1 };
      const res = await axios.put(`${apiBaseUrl}/api/orders/${id}`, {
        status: updatedOrder.status,
      });

      setOrderList((prev) =>
        prev.map((order) => (order._id === id ? res.data : order))
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("An error occurred while updating the order status.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Products</h1>
        <table className={styles.table}>
          <thead>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {BreadList.map((product) => (
              <tr className={styles.trTitle} key={product._id}>
                <td>
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    objectFit="cover"
                    alt={product.title}
                  />
                </td>
                <td>{product._id.slice(0, 5)}...</td>
                <td>{product.title}</td>
                <td>₦{product.prices[0]}</td>
                <td>
                  <button
                    className={styles.button}
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.item}>
        <h1 className={styles.title}>Orders</h1>
        <button
          onClick={clearClosedOrders}
          className={styles.clearButton}
        >
          Clear Closed Orders
        </button>
        <table className={styles.table}>
          <thead>
            <tr className={styles.trTitle}>
              <th>Id</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr className={styles.trTitle} key={order._id}>
                <td>{order._id.slice(0, 5)}...</td>
                <td>{order.customer}</td>
                <td>₦{order.total}</td>
                <td>{order.method === 0 ? "cash" : "paid"}</td>
                <td>{status[order.status]}</td>
                <td>
                  <button onClick={() => handleStatus(order._id)}>
                    Next Stage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies || {};

  if (token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  try {
    const productRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    const orderRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);

    return {
      props: {
        products: productRes.data,
        orders: orderRes.data,
      },
    };
  } catch (err) {
    console.error("Error fetching products/orders:", err.message);
    return {
      props: {
        products: [],
        orders: [],
      },
    };
  }
};

export default Index;
