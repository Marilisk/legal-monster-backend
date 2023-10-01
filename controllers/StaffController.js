import UserModel from "../models/UserModel.js";



export const getMyStaff = async (req, res) => {
    try {
        const ownerId = req.ownerId
        const staffRole = req.params.role
        let staff = await UserModel.find({ ownerId: ownerId, role: staffRole })
            .populate('ownerId').exec(); //последние два метода нужны чтобы получить не только айди, но и его данные все
        res.json(staff);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось выгрузить менеджеров',
        })
    }
}



