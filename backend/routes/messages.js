import {getMessages, saveMessage} from '../controller/messages.js'

import express from 'express'

const router=express.Router();

router.post('/save', saveMessage);
router.post('/getMessages', getMessages);

export default router;