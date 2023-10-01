import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";




export const deleteTokens = async (req, res) => {
    try {
        const ownerId = req.ownerId
        const user = await UserModel.find({ ownerId})
        const ancientTime = new Date().getTime() - 60 * 1000 * 60 * 60 * 24 * 90
        let oldTokens
        if (user.email === 'm6868221@ya.ru') {
            oldTokens = await TokenModel.deleteMany({createdAt: Date.getTime(createdAt) < ancientTime  })
        }
        
               
        res.json(oldTokens);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось выгрузить менеджеров',
        })
    }
}