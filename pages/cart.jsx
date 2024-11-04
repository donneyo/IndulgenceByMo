import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { reset } from "../redux/cartSlice";
import OrderDetail from "../components/OrderDetail";
import dynamic from "next/dynamic"; // Import dynamic from Next.js for Paystack
import styles from "../styles/Cart.module.css";
import Image from "next/image";

// Dynamically import PaystackButton without server-side rendering
const PaystackButton = dynamic(() => import("react-paystack").then(mod => mod.PaystackButton), { ssr: false });

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const amount = cart.total * 100; // Amount in kobo (NGN)

  const dispatch = useDispatch();
  const router = useRouter();

  // Ensure publicKey is available
  const publicKey = "pk_test_ed79e93cfe74a06f17c7701a837c83c9e01b52cc"; // Replace with your Paystack public key

  const createOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
      if (res.status === 201) {
        dispatch(reset());
        router.push(`/orders/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Paystack onSuccess callback
  const handlePaystackSuccessAction = (reference) => {
    createOrder({
      customer: "Customer Name",
      address: "Customer Address",
      total: cart.total,
      method: 1, // 1 can indicate Paystack payment in your backend
    });
  };

  // Paystack onClose callback
  const handlePaystackCloseAction = () => {
    console.log("Payment dialog closed");
  };

  // Paystack config
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: "customer@example.com",
    amount: amount,
    publicKey: publicKey,
    onSuccess: handlePaystackSuccessAction,
    onClose: handlePaystackCloseAction,
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </tbody>
          <tbody>
            {cart.products.map((product) => (
              <tr className={styles.tr} key={product._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={product.img}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                    />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{product.title}</span>
                </td>
                <td>
                  <span className={styles.extras}>
                    {product.extras.map((extra) => (
                      <span key={extra._id}>{extra.text}, </span>
                    ))}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>₦{product.price}</span>
                </td>
                <td>
                  <span className={styles.quantity}>{product.quantity}</span>
                </td>
                <td>
                  <span className={styles.total}>
                    ₦{product.price * product.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.totalText}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>₦{cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>₦0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>₦{cart.total}
          </div>
          {open ? (
            <div className={styles.paymentMethods}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                CASH ON DELIVERY
              </button>
              {/* Paystack Payment Button */}
              <PaystackButton
                {...paystackConfig}
                className={styles.payButton}
                text="PAY WITH CARD"
              />
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>
          )}
        </div>
      </div>
      {cash && <OrderDetail total={cart.total} createOrder={createOrder} />}
    </div>
  );
};

export default Cart;
