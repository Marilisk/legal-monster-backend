import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export default (targetRoles) => {

    return async (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }
    
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return res.status(403).json({ message: 'no token' });
            }
            const userId = jwt.verify(refreshToken, JWT_REFRESH_SECRET).id;
            const {role, ownerId, powers} = await UserModel.findById(userId);
            let hasRole = false;
            if (targetRoles.includes(role)) {
                hasRole = true;
                req.userId = userId;
                req.role = role;
                req.powers = powers;
                if (role === 'owner') {
                    req.ownerId = userId
                } else {
                    req.ownerId = ownerId
                }
            }
            if (!hasRole) {
                return res.status(403).json({message: 'You have no access'})
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'User s not authorised' })
        }
    }
}