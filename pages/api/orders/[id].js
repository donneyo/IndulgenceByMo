import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const order = await Order.findById(id);
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  if (method === "PUT") {
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  if (method === "DELETE") {
      try {
        // Delete all orders where the status is 3 (meaning "Order Closed")
        const result = await Order.deleteMany({ status: 3 });
        res.status(200).json({ message: `${result.deletedCount} closed orders deleted.` });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete closed orders", error });
      }
    } else {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default handler;
