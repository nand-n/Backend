
import {Router} from 'express'
import { createHome, findHome } from './FindHome'

const router=Router()


router.post('/create-home' , createHome)
router.post('/find-home', findHome)    



export default router