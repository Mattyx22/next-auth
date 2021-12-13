import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'


export default async function registerUser(req, res) {
        const user = req.body
        const hashPass = await bcrypt.hash(user.password, 12)
        await prisma.user.create({
            data: {
                name: user.username,
                email: user.email,
                password: hashPass
            }
          })
          res.status(200).json({"success": "true"})

  }