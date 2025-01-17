import cookie from "cookie";

const handler = (req, res) => {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Validate input data
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required!" });
    }

    // Authenticate user
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Set token in cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", process.env.TOKEN, {
          maxAge: 60 * 60, // 1 hour
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          path: "/",
        })
      );
      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(400).json({ error: "Wrong credentials!" });
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};

export default handler;
