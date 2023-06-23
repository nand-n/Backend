import prisma from "../db";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { comparePassword, createJWT, hashPassword } from "../modules/auth";


export const registerUser = async (req, res) => {
  try {
     const {username  , name , 
      phone,
      email,
      password,
      isAdmin,
      apartment,
      zip,
      street,
      city,
      country
    } = req.body;
 // Validate input
if (!email || !password || !phone || !username ) {
 return res.status(400).json({ error: "Username , phone , Email and password are required" });
}
  // Check if phone already exists
const existingPhone = await prisma.user.findFirst({
 where: { 
  phone 
  },
});
  if (existingPhone ) {
 return res.status(400).json({ error: "phone number already exist ,please Use another phone number" });
}
// Check if userEmail already exists
const existingEmail = await prisma.user.findFirst({
 where: { email },
});
if (existingEmail) {
 return res.status(400).json({ error: "User Email already exists,please use another" });
}
// Check if username already exists
const existingUsername = await prisma.user.findFirst({
 where: { username },
});

if (existingUsername) {
 return res.status(400).json({ error: "Username already exists,Try another username" });
}

 const user = await prisma.user.create({
     data: {
       username: username,
       email: email,
       password: await hashPassword(password),
       phone: phone, 
       apartment:apartment,
        street:street,
        city:city,
        country:country

         
     },
 })    
 if (!user) {
     return res.status(400).json({errorMessage:"Faild to register the user"})
 }
    const tokens = createJWT(user)
    
    console.log(tokens.refreshToken)
  
    return  res.json({ tokens , user });
      
  } catch (err) {
     console.log(err);
 res.status(500).json({ error: `Something went wrong with the server or error with ${err.message}` });
 
  }
}

//Create admin 
export const createNewAdminUser = async (req, res) => {
     try {
        const { email, password ,username ,phone ,apartment ,
          street,
          city,
          country} = req.body;
    // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
     // Check if user already exists
  const existingPhone = await prisma.user.findUnique({
    where: { phone },
  });
     if (existingPhone) {
    return res.status(400).json({ error: "phone number already exist ,please Use another phone number" });
  }
  // Check if userEmail already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    return res.status(400).json({ error: "User Email already exists,please use another" });
  }
// Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    return res.status(400).json({ error: "Username already exists,Try another username" });
  }

    const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: await hashPassword(password),
          phone: phone,
          isAdmin:true ,
          apartment:apartment,
          street:street,
          city:city,
          country:country

        },
    })    
    if (!user) {
        return res.status(400).json({errorMessage:"Faild to register the user"})
    }
       const tokens = createJWT(user)
       
       console.log(tokens.refreshToken)
        //save refreshtoken to database

     
      return   res.json({ Message: `Admin user : ${tokens.accessToken.name} Sucessfully Created` ,tokens });
         
     } catch (err) {
        console.log(err);
   return res.status(500).json({ error: "Something went wrong with the server" });
    
     }
}

export const signIn = async (req, res) => {
       const { password ,username } = req.body;
     try {
    // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  // Check if user doesn't exists
  const existingUser = await prisma.user.findFirst({
    where: { username },
  });
  if (!existingUser) {
    return res.status(400).json({ error: "There is no registered user with this Username!!!" });
  }

    const user = await prisma.user.findFirst({
        where: {
            username: username,
        },
        select:{
         password:true,
         id:true
        }
        
    })
//  Check if user doesn't exists
     if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
    //Check if the user password is valid 
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return  res.status(401).json({ errorMessage: 'Please insert the Correct password!!!' })
        
    }
  const tokens = createJWT(user)
  if (!tokens) {
   return res.status(400).json({Message:"Error Generating Access Token and Refresh Token , Please Try Again."})
  }
  const userInfo=await prisma.user.findUnique({
    where:{
      id:user.id
    },
    select:{
      email:true,
      phone:true,
      username:true,
      id:true
    }

  })
   res.status(200).json({tokens,userInfo })
     } catch (error) {
      return res.status(500).json({
        message:`Error with Internal Server or Error with ${error.message}`
      })
     }
}


