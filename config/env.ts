import dotenv from "dotenv"

dotenv.config()

export const config = {
  email: process.env.EMAIL || process.env.LT_EMAIL || "",
  password: process.env.PASSWORD || process.env.LT_PASSWORD || "",
}
