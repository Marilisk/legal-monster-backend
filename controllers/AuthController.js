import CandidateModel from "../models/CandidateModel.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import mailService from "../services/mail-service.js";
import tokenService from "../services/token-service.js";
import TokenModel from "../models/TokenModel.js";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const API_URL = process.env.API_URL
const CLIENT_URL = process.env.CLIENT_URL



export const register = async (req, res, next) => {
    try {
        const { email, fullName, password } = req.body;
        const alreadyExists = await UserModel.findOne({ email })
        if (alreadyExists) {
            return res.status(400).json({ message: `Email ${email} is already taken` });
        }
        let role = 'owner'
        let ownerId = null
        //проверяем не завёл ли его owner как сотрудника и проводим в таком случае с соответствующей ролью
        const candidate = await CandidateModel.findOne({ email })
        if (candidate) {
            role = candidate.role
            ownerId = candidate.ownerId
            await CandidateModel.findOneAndDelete({ _id: candidate._id })
        }

        const salt = await bcrypt.genSalt(3)
        const hashPassword = await bcrypt.hash(password, salt)
        const activationLink = uuidv4();
        const user = await UserModel.create({
            email,
            fullName,
            password: hashPassword,
            activationLink,
            role,
            ownerId,
        })
        await mailService.sendActivationMail(email, `${API_URL}/auth/activate/${activationLink}`);
        const tokensPayload = { email: user.email, id: user.id, isActivated: user.isActivated };
        const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, { expiresIn: '180d' });
        const tokens = { accessToken, refreshToken };
        await tokenService.saveToken(tokensPayload.id, tokens.refreshToken);
        res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.json({user, tokens});
    } catch (error) {
        console.log('register error', error);
        res.status(500).json({
            message: 'Cannot register'
        })
    }
}


export const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            return res.status(404).json({
                message: 'Incorrect authorisation link',
            });
        }
        user.isActivated = true;
        await user.save()
        return res.redirect(`${CLIENT_URL}`)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'can not activate',
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: `имейл ${email} не зарегистрирован` });
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: 'неверный логин или пароль' })
        }
        //const userData = await userService.login(user);
        const tokensPayload = { email: user.email, id: user.id, isActivated: user.isActivated, role: user.role };
        const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, { expiresIn: '180d' });
        const tokens = { accessToken, refreshToken };

        await tokenService.saveToken(user.id, refreshToken);
        res.cookie('refreshToken', tokens.refreshToken,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.json({ tokens, user });
    } catch (error) {
        console.log('login error', error);
        res.status(500).json({
            message: 'Cannot login'
        })
    }
}

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await TokenModel.deleteOne({ refreshToken })
        res.clearCookie('refreshToken');
        return res.json(token)
    } catch (error) {
        console.log('logout error', error);
        res.status(500).json({
            message: 'Cannot logout'
        })
    }
}



export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const tokenFromDB = await TokenModel.findOne({ refreshToken })
        if (!refreshToken || !userData || !tokenFromDB) {
            return res.status(401).json({ message: `не найден токен или данные пользователя` });
        }
        const user = await UserModel.findById(userData.id);
        const userPayload = { email: user.email, id: user.id, isActivated: user.isActivated };
        const accessToken = jwt.sign(userPayload, JWT_ACCESS_SECRET, { expiresIn: '15m' })
        const newRefreshToken = jwt.sign(userPayload, JWT_REFRESH_SECRET, { expiresIn: '180d' });
        const tokens = { accessToken, refreshToken: newRefreshToken };
        await tokenService.saveToken(userPayload.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        return res.json({ user, tokens });
    } catch (error) {
        console.log('refresh error', error)
        return res.status(500).json({
            message: 'Cannot refresh'
        })
    }
}



export const createstaff = async (req, res, next) => {
    try {
        const ownerId = req.userId;
        const { email, role } = req.body;
        const alreadyExists = await UserModel.findOne({ email })
        const isCandidate = await CandidateModel.findOne({ email })
        if (isCandidate || alreadyExists) {
            return res.status(400).json({ message: `Сотрудник с ${email} уже есть в базе` });
        }
        const candidate = await CandidateModel.create({
            email,
            role,
            ownerId,
        })
        res.json(candidate);
    } catch (error) {
        console.log('candidate error', error);
        res.status(500).json({
            message: 'Не удалось создать кандидата'
        })
    }
}


export const getCandidates = async (req, res, next) => {
    try {
        const ownerId = req.ownerId
        let candidates = await CandidateModel.find({ ownerId: ownerId, })
            .populate('ownerId').exec(); //последние два метода нужны чтобы получить не только айди, но и его данные все
               
        res.json(candidates);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось выгрузить менеджеров',
        })
    }
}




