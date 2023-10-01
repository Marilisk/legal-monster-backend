import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { loginValidator, registerValidator } from './utils/authValidation.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";
import {
    AuthController,
    ClientController,
    StaffController,
    UtilsController,
    NotesController,
} from './controllers/index.js';
import roleMiddleWare from './middlewares/roleMiddleWare.js';


const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI || '')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err)
    );

const app = express()

// for develop mode fixing cert error:
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'],
    preflightContinue: true,
}));

// AUTHENTIFICATION & USER METHODS
app.post('/auth/register', registerValidator, handleValidationErrors, AuthController.register)
app.get('/auth/activate/:link', AuthController.activate)
app.post('/auth/login', loginValidator, handleValidationErrors, AuthController.login)
app.post('/auth/logout', AuthController.logout)
app.get('/auth/refresh', AuthController.refresh)

app.post('/auth/createstaff', roleMiddleWare(['owner']), AuthController.createstaff)
app.get('/auth/getcandidates', roleMiddleWare(['owner']), AuthController.getCandidates)

// CLIENTS
app.get('/clients/getall', roleMiddleWare(['owner', 'manager']), ClientController.getAll)
app.post('/clients/create', roleMiddleWare(['owner', 'manager']), ClientController.create)
app.post('/clients/edit', roleMiddleWare(['owner', 'manager']), ClientController.edit)
app.delete('/clients/delete/:clientId', roleMiddleWare(['owner', 'manager', 'lawyer']), ClientController.deleteClient)
app.patch('/clients/staff/edit/:clientId', roleMiddleWare(['owner']), ClientController.editStaff)



// NOTES
app.get('/notes/getbyclient/:clientId', roleMiddleWare(['owner', 'manager', 'lawyer']), NotesController.getNotesByClient)
app.post('/notes/create', roleMiddleWare(['owner', 'manager', 'lawyer']), NotesController.create)
app.delete('/notes/deletenote/:noteId', roleMiddleWare(['owner', 'manager', 'lawyer']), NotesController.deleteNote)
app.post('/notes/edit', roleMiddleWare(['owner', 'manager']), NotesController.editNote)



// OWNER ADMIN METHODS
app.post('/pipeline/edit', roleMiddleWare(['owner', 'manager']), ClientController.editPipeline)


// STAFF
app.get('/staff/getmystaff/:role', roleMiddleWare(['owner', 'manager']), StaffController.getMyStaff)


//CLEAR BASE тут надо продмать мехаизм удаления токенов которым больше например 1 месяца, а то их в базе дофига уже
app.delete('/utils/creartokens', roleMiddleWare(['owner']), UtilsController.deleteTokens)


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`server OK on ${PORT}`);
});