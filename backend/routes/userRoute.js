import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, getMedicalRecords } from '../controllers/userController.js';
import { loginPatient } from '../controllers/patientController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/patient-login", loginPatient)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.get("/medical-records", authUser, getMedicalRecords)

export default userRouter;