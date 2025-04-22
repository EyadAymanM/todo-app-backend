import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db.js";


export const login = async (req,res)=>{
  const { email, password } = req.body;

  // checking if the req body is missing any values
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  // 
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" });
    // if there's no user registered with this email
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    // checking password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    // assigning token to be returned for browser
    // using hardcoded string instead of using .env file
    const token = jwt.sign({ id: user.id, email: user.email }, 'any_secret_string_instead_of_using_.env', {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  });
};


export const register = async (req,res)=>{
  const { email, password } = req.body;
  // checking if the req body is missing any values
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // registering a new user
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(409).json({ error: "Email already exists" });
        }

        res.status(201).json({ id: this.lastID, email });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};