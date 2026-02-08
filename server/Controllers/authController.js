import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import user from "../Models/user.js";

// Register a new user
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await user.findOne({ email });
        if (exists) return res.status(400).json({ message: "User exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            name, email, password: hashedPassword, role: "patient",
        });

        // Generate token so the user is logged in immediately
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role, name: newUser.name, email: newUser.email }, 
            process.env.SECRET_KEY, 
            { expiresIn: "1d" }
        );

        res.cookie('authToken', token, { httpOnly: true }); // Set the cookie here!

        res.status(201).json({
            message: `${newUser.name} successfully registered`,
            user: { role: newUser.role, name: newUser.name, id: newUser._id, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }  
};

// Login user and generate JWT token
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const User = await user.findOne({ email });
        if (!User) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, User.password);

        if (isValid) {
            const token = jwt.sign({ 
                id: User._id, 
                role: User.role,
                email: User.email,
                name: User.name,
            }, process.env.SECRET_KEY, { expiresIn: "1d" });

            // 1. SET THE COOKIE
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: false, // Set to true in production with HTTPS
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            // 2. SEND SUCCESS RESPONSE
            return res.status(200).json({
                message: "Logged in successfully",
                user: {
                    id: User._id,
                    role: User.role,
                    name: User.name,
                    email: User.email
                }
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
    }
};

export const getUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }
  res.json({
    role: req.user.role,
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};


export const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
