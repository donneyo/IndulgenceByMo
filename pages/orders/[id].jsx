import styles from "../../styles/Order.module.css";
import Image from "next/image";
import axios from "axios";

const Order = ({ order }) => {
  const status = order.status;

  const statusClass = (index) => {
    if (index - status < 1) return styles.done;
    if (index - status === 1) return styles.inProgress;
    if (index - status > 1) return styles.undone;
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.row}>
          <table className={styles.table}>
            <tr className={styles.trTitle}>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total</th>
            </tr>
            <tr className={styles.tr}>
              <td>
                <span className={styles.id}>{order._id}</span>
              </td>
              <td>
                <span className={styles.name}>{order.customer}</span>
              </td>
              <td>
                <span className={styles.address}>{order.address}</span>
              </td>
              <td>
                <span className={styles.total}>${order.total}</span>
              </td>
            </tr>
          </table>
        </div>
        <div className={styles.row}>
          <div className={statusClass(0)}>
            <Image src="/img/paid.png" width={30} height={30} alt="" />
            <span className={styles.payment}>Payment</span>
            <div className={styles.checkedIcon}>
              <Image
                className={styles.checkedIcon}
                src="/img/checked.png"
                width={20}
                height={20}
                alt=""
              />
            </div>
          </div>
          <div className={statusClass(1)}>
            <Image src="/img/bake.png" width={30} height={30} alt="" />
            <span className={styles.payment}>Preparing</span>
            <div className={styles.checkedIcon}>
              <Image
                className={styles.checkedIcon}
                src="/img/checked.png"
                width={20}
                height={20}
                alt=""
              />
            </div>
          </div>
          <div className={statusClass(2)}>
            <Image src="/img/bike.png" width={30} height={30} alt="" />
            <span className={styles.payment}>On the way</span>
            <div className={styles.checkedIcon}>
              <Image
                className={styles.checkedIcon}
                src="/img/checked.png"
                width={20}
                height={20}
                alt=""
              />
            </div>
          </div>
          <div className={statusClass(3)}>
            <Image src="/img/delivered.png" width={30} height={30} alt="" />
            <span className={styles.payment}>Delivered</span>
            <div className={styles.checkedIcon}>
              <Image
                className={styles.checkedIcon}
                src="/img/checked.png"
                width={20}
                height={20}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${order.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${order.total}
          </div>
          <button disabled className={styles.button}>
            PAID
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(`http://localhost:3000/api/orders/${params.id}`);
  return {
    props: { order: res.data },
  };
};

export default Order;

// import styles from "../../styles/Order.module.css";
// import Image from "next/image";
//
//
//
// const Order = () => {
// const status = 2;
//
//   const statusClass = (index) => {
//     if (index - status < 1) return styles.done;
//     if (index - status === 1) return styles.inProgress;
//     if (index - status > 1) return styles.undone;
//   };
//
//
//     return (
//          <div className={styles.container}>
//            <div className={styles.left}>
//              <div className={styles.row}>
//                  <table className={styles.table}>
//                           <tr className={styles.trTitle}>
//                                  <th>Order ID</th>
//                                  <th>Customer</th>
//                                  <th>Address</th>
//                                  <th>Total</th>
//                                </tr>
//                                <tr className={styles.tr}>
//                                  <td>
//                                    <span className={styles.id}>123455jshdjdlmm4</span>
//                                  </td>
//                                  <td>
//                                    <span className={styles.name}>Don Neyo
//                                    </span>
//                                  </td>
//                                  <td>
//                                    <span className={styles.address}>2 akinwunmi st yaba lagos </span>
//                                  </td>
//                                  <td>
//                                    <span className={styles.total}>₦ 10,000</span>
//                                  </td>
//                                </tr>
//                              </table>
//              </div>
//               <div className={styles.row}>
//                     <div className={statusClass(0)}>
//                         <Image src="/img/paid.png" width={30} height={30} alt=""/>
//                         <span className={styles.payment}>Payment</span>
//                         <div className={styles.checkedIcon}>
//                          <Image className={styles.checkedIcon}
//                           src="/img/checked.png"
//                            width={20}
//                             height={20}
//                             alt=""
//                             />
//                             </div>
//                     </div>
//                <div className={statusClass(1)}>
//                <Image src="/img/bake.png" width={30} height={30} alt=""/>
//                <span className={styles.payment}>Preparing</span>
//                 <div className={styles.checkedIcon}>
//                  <Image className={styles.checkedIcon}
//                   src="/img/checked.png"
//                   width={20}
//                    height={20}
//                    alt=""
//                     />
//                     </div>
//                      </div>
//                <div className={statusClass(2)}>
//                <Image src="/img/bike.png" width={30} height={30} alt=""/>
//                 <span className={styles.payment}>On the way</span>
//                 <div className={styles.checkedIcon}>
//                  <Image className={styles.checkedIcon}
//                  src="/img/checked.png"
//                  width={20}
//                  height={20}
//                  alt=""
//                   />
//                 </div>
//                 </div>
//                <div className={statusClass(3)}>
//                 <Image src="/img/delivered.png" width={30} height={30} alt=""/>
//                  <span className={styles.payment}>Delivered</span>
//                   <div className={styles.checkedIcon}>
//                    <Image className={styles.checkedIcon}
//                    src="/img/checked.png"
//                     width={20}
//                      height={20}
//                       alt=""
//                          />
//                   </div>
//                       </div>
//
//                </div>
//             </div>
//              <div className={styles.right}>
//                     <div className={styles.wrapper}>
//                       <h2 className={styles.title}>CART TOTAL</h2>
//                       <div className={styles.totalText}>
//                         <b className={styles.totalTextTitle}>Subtotal:</b>₦ 10,000
//                       </div>
//                       <div className={styles.totalText}>
//                         <b className={styles.totalTextTitle}>Discount:</b>₦ 10
//                       </div>
//                       <div className={styles.totalText}>
//                         <b className={styles.totalTextTitle}>Total:</b>₦ 10,000
//                       </div>
//                       <button disabled className={styles.button}> PAID </button>
//                     </div>
//                   </div>
//                </div>
//         );
//     };
// export default Order;
//
// {/*        <div className={styles.container}> */}
// {/*          <div className={styles.left}> */}
// {/*            <div className={styles.row}> */}
// {/*              <table className={styles.table}> */}
// {/*                <tr className={styles.trTitle}> */}
// {/*                  <th>Order ID</th> */}
// {/*                  <th>Customer</th> */}
// {/*                  <th>Address</th> */}
// {/*                  <th>Total</th> */}
// {/*                </tr> */}
// {/*                <tr className={styles.tr}> */}
// {/*                  <td> */}
// {/*                    <span className={styles.id}>{order._id}</span> */}
// {/*                  </td> */}
// {/*                  <td> */}
// {/*                    <span className={styles.name}>{order.customer}</span> */}
// {/*                  </td> */}
// {/*                  <td> */}
// {/*                    <span className={styles.address}>{order.address}</span> */}
// {/*                  </td> */}
// {/*                  <td> */}
// {/*                    <span className={styles.total}>${order.total}</span> */}
// {/*                  </td> */}
// {/*                </tr> */}
// {/*              </table> */}
// {/*            </div> */}
// {/*            <div className={styles.row}> */}
// {/*              <div className={statusClass(0)}> */}
// {/*                <Image src="/img/paid.png" width={30} height={30} alt="" /> */}
// {/*                <span>Payment</span> */}
// {/*                <div className={styles.checkedIcon}> */}
// {/*                  <Image */}
// {/*                    className={styles.checkedIcon} */}
// {/*                    src="/img/checked.png" */}
// {/*                    width={20} */}
// {/*                    height={20} */}
// {/*                    alt="" */}
// {/*                  /> */}
// {/*                </div> */}
// {/*         </div> */}
