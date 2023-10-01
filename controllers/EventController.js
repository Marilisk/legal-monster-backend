import { query } from "express";
import EventModel from "../models/EventModel.js";



export const createEvent = async (req, res) => {
    try {
        const newEvent = new EventModel({
            startDate: {
                day: req.body.startDate.day,
                month: req.body.startDate.month,
                year: req.body.startDate.year,
                time: req.body.startDate.timeStamp
            },
            finishDate: {
                day: req.body.finishDate.day,
                month: req.body.finishDate.month,
                year: req.body.finishDate.year,
                time: req.body.finishDate.timeStamp

            },
            title: req.body.title,
            description: req.body.description,
            owner: {
                userId: req.body.owner.userId,
                userName: req.body.owner.userName,
                authorId: req.body.owner.authorId,
            },
            client: {
                clientId: req.body.client.clientId,
                clientName: req.body.client.clientName,
            },
            type: req.body.type
            
        });
        const survey = await newEvent.save();
        res.json(survey);
    } catch (error) {
        console.log('createTask error ', error);
        res.status(500).json({
            message: 'Не удалось создать событие',
        })
    }
}


export const getEvents = async (req, res) => {
    try {
        const qmonth = query.month
        const qyear = query.year
        /* const tasks = await TaskModel.find({startDate: qmonth});
        res.json(surveys) */
    } catch (error) {
        console.log(error)
    }
}