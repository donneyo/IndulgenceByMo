import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Admin.module.css";
import jwt from "jsonwebtoken";

const Index = ({ orders, products }) => {
  const [BreadList, setBreadList] = useState(products);
  const [orderList, setOrderList] = useState(orders);
  const status = ["preparing", "on the way", "delivered", "Order Closed"];
  const router = useRouter();

const clearClosedOrders = async () => {
  try {
    const res = await axios.delete("http://localhost:3000/api/orders/clearClosed");
    alert(res.data.message);
    // Optionally refresh the order list after deletion
    setOrderList(orderList.filter(order => order.status !== 3));
  } catch (error) {
    console.error("Failed to delete closed orders:", error);
  }
};


 const handleEdit = (id) => {
   console.log("Edit button clicked with ID:", id);
   if (id) {
     router.push(`/admin/edit/${id}`);
   } else {
     console.error("Product ID is undefined");
   }
 };


  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/products/" + id
      );
      setBreadList(BreadList.filter((bread) => bread._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id) => {
    const item = orderList.filter((order) => order._id === id)[0];
    const currentStatus = item.status;

    try {
      const res = await axios.put("http://localhost:3000/api/orders/" + id, {
        status: currentStatus + 1,
      });
      setOrderList([
        res.data,
        ...orderList.filter((order) => order._id !== id),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Products</h1>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </tbody>
          {BreadList.map((product) => (
            <tbody key={product._id}>
              <tr className={styles.trTitle}>
                <td>
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    objectFit="cover"
                    alt=""
                  />
                </td>
                <td>{product._id.slice(0, 5)}...</td>
                <td>{product.title}</td>
                <td>₦{product.prices[0]}</td>
                <td>
                  <button
                      className={styles.button}
                      onClick={() => handleEdit(product._id)}
                    >Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>Orders</h1>
        <button onClick={clearClosedOrders} className={styles.clearButton}> Clear Closed Orders</button>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Id</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </tbody>
          {orderList.map((order) => (
            <tbody key={order._id}>
              <tr className={styles.trTitle}>
                <td>{order._id.slice(0, 5)}...</td>
                <td>{order.customer}</td>
                <td>₦{order.total}</td>
                <td>
                  {order.method === 0 ? <span>cash</span> : <span>paid</span>}
                </td>
                <td>{status[order.status]}</td>
                <td>
                  <button onClick={() => handleStatus(order._id)}>
                    Next Stage
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>

      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";

  // Check if the token matches
  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  try {
    const productRes = await axios.get("http://localhost:3000/api/products");
    const orderRes = await axios.get("http://localhost:3000/api/orders");

    return {
      props: {
        products: productRes.data,
        orders: orderRes.data,
      },
    };
  } catch (err) {
    console.error("Error fetching products/orders:", err.response ? err.response.data : err.message);
    return {
      props: {
        products: [],
        orders: [],
        error: true,
      },
    };
  }
};

// Ensure the Index component is defined elsewhere in the same file or imported here
export default Index;
