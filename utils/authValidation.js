import { body } from 'express-validator';

export const loginValidator = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'длина пароля д б не менее 5 симв').isLength({min: 5}),
];

export const registerValidator = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'длина пароля д б не менее 5 симв').isLength({min: 5}),
    body('fullName', 'длина имени д б не менее 3 симв').isLength({min: 3}),
];