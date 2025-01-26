import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
    cookies,
  } = req;

  const token = cookies.token;

  try {
    // Establish database connection
    await dbConnect();
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    return res.status(500).json({ message: "Database connection error" });
  }

  if (method === "GET") {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      console.error("Error fetching product:", err.message);
      res.status(500).json({ message: "Error fetching product" });
    }
  }

  if (method === "PUT") {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error("Error updating product:", err.message);
      res.status(500).json({ message: "Error updating product" });
    }
  }

  if (method === "DELETE") {
    if (!token || token !== process.env.token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Error deleting product:", err.message);
      res.status(500).json({ message: "Error deleting product" });
    }
  }
}
