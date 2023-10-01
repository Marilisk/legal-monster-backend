import ClientModel from "../models/ClientModel.js";
import UserModel from "../models/UserModel.js";


export const create = async (req, res) => {
    try {
        const userId = req.userId
        const ownerId = req.ownerId
        const creatorRole = req.role

        const doc = new ClientModel({
            name: req.body.name,
            form: req.body.form,
            ownerId,
            INNnumber: req.body.INNnumber,
            contactPersons: req.body.contactPersons,
            phase: req.body.phase,
            managers: creatorRole === 'manager' ? [...req.body.managers, userId] : req.body.managers,
            lawyers: req.body.lawyers,
            contracts: req.body.contracts,
            projects: req.body.projects,
            //events: req.body.events,
            creatorId: userId,
        });

        const client = await doc.save();
        res.json(client);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать клиента',
        })
    }
}

export const edit = async (req, res) => {
    try {
        const client = await ClientModel.findByIdAndUpdate(
            { _id: req.body._id },
            {
                name: req.body.name,
                form: req.body.form,
                INNnumber: req.body.INNnumber,
                contactPersons: req.body.contactPersons,
                phase: req.body.phase,
                managers: req.body.managers,
                lawyers: req.body.lawyers,
                contracts: req.body.contracts,
                projects: req.body.projects,
                events: req.body.events,
                creatorId: req.body.creatorId,
                //notes: req.body.notes
            },
            { returnDocument: 'after' }
        );
        res.json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать клиента',
        })
    }
}


export const getAll = async (req, res) => {
    try {
        const userId = req.userId
        const ownerId = req.ownerId
        const userRole = req.role
        let clients = await ClientModel.find({ ownerId: ownerId })
            .populate('creatorId').exec(); //последние два метода нужны чтобы получить не только айди продукта, но и его данные все
        if (userRole === 'manager') {
            clients = clients.filter(client => client.managers.includes(userId))
        }
        res.json(clients);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось выгрузить клиентов',
        })
    }
}

export const editPipeline = async (req, res) => {
    try {
        const role = req.role
        const canManage = req.powers.canEditSalesPipeline
        if (role !== 'owner' && !canManage) {
            return res.status(403).json({ message: 'no powers for edit' });
        }
        const owner = await UserModel.findById(req.ownerId)
        const oldOwnerSettings = owner?.ownerSettings
        if (!oldOwnerSettings) {
            return res.status(403).json({ message: 'oldOwnerSettings' });
        }
        const ownerNew = await UserModel.findByIdAndUpdate(
            { _id: req.ownerId },
            {
                ownerSettings: {
                    ...oldOwnerSettings,
                    salesPipeline: {
                        isCustom: true,
                        pipeline: req.body,
                    },
                }
            },
            { returnDocument: 'after' }
        )

        const otherUsers = await UserModel.updateMany(
            { ownerId: req.ownerId },
            {
                ownerSettings: {
                    ...oldOwnerSettings,
                    salesPipeline: {
                        isCustom: true,
                        pipeline: req.body,
                    },
                }
            },
            { returnDocument: 'after' }
        )
        res.json({ pipeline: ownerNew?.ownerSettings?.salesPipeline?.pipeline });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось отредактировать воронку',
        })
    }
}


export const deleteClient = async (req, res) => {
    try {
        const clientId = req.params
        const canDelete = req.role === 'owner' ? true : req.powers.canDeleteClients
        if (!canDelete) {
            return res.status(404).json({
                message: 'Нет полномочий для удаления клиента',
            })
        }
        await ClientModel.findByIdAndDelete(clientId.clientId)
        res.json(clientId);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить клиента',
        })
    }
}

export const editStaff = async (req, res) => {
    try {
        const clientId = req.params.clientId
        const staffName = req.body.staffName
        const client = await ClientModel.findByIdAndUpdate(
            { _id: clientId },
            {
                [staffName]: req.body.newValuesArr,
            },
            { returnDocument: 'after' }
        );
        res.json(client[staffName]);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать клиента',
        })
    }
}












