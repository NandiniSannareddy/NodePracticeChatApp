import { changePassword, createUser, forgot, login, sendOtp, usersList, verifiedStatus, verify, verifyOTP } from "../controller/user.js";
import express from 'express'

const router=express.Router();
router.post('/create', createUser);
router.post('/login', login);
router.get('/verify/:token', verify);
router.post('/forgot', forgot);
router.get('/verifiedStatus/:id', verifiedStatus);
router.post('/resetPassOtp', sendOtp);
router.post('/verifyOTP', verifyOTP);
router.post('/changePassword', changePassword);
router.post('/usersList', usersList)

export default router;