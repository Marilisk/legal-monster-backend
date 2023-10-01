import NoteModel from "../models/NoteModel.js";
import UserModel from "../models/UserModel.js";


export const create = async (req, res) => {
    try {
        const userId = req.userId
        const doc = new NoteModel({
            author: {
                authorId: userId,
                fullName: req.body.author.fullName,
            },
            deadLine: req.body.deadLine,
            title: req.body.title,
            text: req.body.text,
            priority: req.body.priority,
            isDone: req.body.isDone,
            clientId: req.body.clientId,
        })
        const newNote = await doc.save()
        res.json(newNote);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать заметку',
        })
    }
}

export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params
        const canDelete = req.role === 'owner' ? true : req.powers.canDeleteClients
        if (!canDelete) {
            return res.status(404).json({
                message: 'Нет полномочий для удаления заметок',
            })
        }
        const result = await NoteModel.findByIdAndDelete(noteId)
        /* if (!client) {
            return res.status(404).json({ message: 'Клиент не найден', })
        } */
        res.json({message: 'Заметка успешно удалена', noteId});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить заметку',
        })
    }
}

export const getNotesByClient = async (req, res) => {
    try {
        const clientId = req.params.clientId
        const notes = await NoteModel.find({ clientId: clientId }).exec()
        res.json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось выгрузить заметки по клиенту',
        })
    }
}

export const editNote = async (req, res) => {
    try {
        const note = await NoteModel.findByIdAndUpdate(
            { _id: req.body._id },
            req.body,
            { returnDocument: 'after' }
        );
        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать клиента',
        })
    }
}

/* 




export const editPipeline = async (req, res) => {
    try {
        const role = req.role
        const canManage = req.powers.canEditSalesPipeline
        if (role !== 'owner' && !canManage) {
            return res.status(403).json({ message: 'no powers for edit' });
        }
        const owner = await UserModel.findById (req.ownerId)
        const oldOwnerSettings = owner.ownerSettings
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
            {ownerId: req.ownerId},
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
        res.json({pipeline: ownerNew.ownerSettings.salesPipeline.pipeline });
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


export const deleteNote = async (req, res) => {
    try {
        const {noteId, clientId} = req.params
        const canDelete = req.role === 'owner' ? true : req.powers.canDeleteClients
        if (!canDelete) {
            return res.status(404).json({
                message: 'Нет полномочий для удаления заметок',
            })
        }
        const clientBefore = await ClientModel.findById(clientId)
        if (!clientBefore) {
            return res.status(404).json({ message: 'Клиент не найден', })
        }

        const filteredNotes = clientBefore.notes.filter(note => note._id.toString() !== noteId)

        const client = await ClientModel.findByIdAndUpdate(
            { _id: clientId }, 
            { notes: filteredNotes }, 
        {returnDocument: 'after'}) 
        //await ClientModel.findByIdAndDelete(clientId.clientId)
        res.json(client.notes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить заметку',
        })
    }
}
 */







