
import {Router} from 'express'
import { MatchRoommate } from './MatchRoommate'

const router=Router()

router.post('/match-roommate', MatchRoommate)    



export default router