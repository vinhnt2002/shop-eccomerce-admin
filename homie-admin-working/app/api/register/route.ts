// import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcrypt';

// const prisma = new PrismaClient();

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, username, password, image } = req.body;

//     try {
//       // Check if the user already exists
//       const userExists = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (userExists) {
//         return res.status(400).json({ error: 'User already exists' });
//       }

//       const hashPassword = await hash(password, 10);

//       // Create a new user
//       const newUser = await prisma.user.create({
//         data: {
//           email,
//           username,
//           password: hashPassword,
//           image,
//         },
//       });

//       return res
//         .status(201)
//         .json({ message: 'User registered successfully', user: newUser });
//     } catch (error) {
//       console.log('Error registering user: ', error.message);
//       return res
//         .status(500)
//         .json({ error: 'An error occurred while registering the user' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }
