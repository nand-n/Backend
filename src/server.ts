import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { createNewAdminUser,  registerUser, signIn } from './handlers/user'
import { protectRoute, userHandler } from './modules/auth'
// import { refreshToken } from './handlers/refreshToken'
import { forgotPassword, forgotPasswordChanger } from './handlers/resetPassword'


const app = express()

//midlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))  

app.get('/', (req, res) => {
    res.status(200)
    res.json({message:`wtf , You shouldn't be Here!  any ways , what ever! `})
})


//Protected Routes , needs access token to access /api routes
app.use('/api', protectRoute, router)

//Register User
app.post('/register', registerUser)

//Signin User
app.post('/signin' , signIn)

//Forget Password Route
// app.post('/forgot-password', forgotPassword)
//Password Changer Route
// app.post('/password-changer', forgotPasswordChanger)

//Refresh Token Route
// app.get('/refresh-token',refreshToken)


export default app