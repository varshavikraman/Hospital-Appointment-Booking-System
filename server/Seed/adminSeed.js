import user from "../Models/user.js";
import bcrypt from 'bcrypt';

const seedAdmin = async () => {
    try {
        const exists = await user.findOne({ role: "admin" });

        if (!exists) {
            // HASH THE PASSWORD BEFORE CREATING
            const hashedPassword = await bcrypt.hash(process.env.password, 10);

            await user.create({
                name: process.env.name,
                email: process.env.email,
                password: hashedPassword, // Use the hashed version
                role: "admin",
            });
            console.log("Admin seeded successfully");
        } else {
            console.log("Admin already exists");
        }
    } catch (error) {
        console.error("Seeding error:", error);
    }
};

export default seedAdmin;