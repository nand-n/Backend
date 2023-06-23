import * as dotenv from 'dotenv'
dotenv.config()
import app from './server'

app.listen(process.env.PORT, () => {
    console.log(`server is running on localhost : ${process.env.PORT}`)
})