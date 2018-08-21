import express from 'express';
import * as UserController from './user-controller';

export default () => {
    let userRouter = express.Router();
    userRouter
        .route('/')
        .get((req, res) => {
            UserController.getUsers()
                .then(users => {
                    res.json({
                        success: true,
                        message: 'users fetched',
                        payload: { users }
                    });
                })
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        })
        .post((req, res) => {
            UserController.createUser(req)
                .then(user =>
                    res.json({
                        success: true,
                        message: 'user created',
                        payload: { user }
                    })
                )
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        });

    userRouter.route('/:id([0-9a-zA-Z]{24})').get((req, res) => {
        UserController.getUser(req.params.id)
            .then(user =>
                res.json({
                    success: true,
                    message: 'user fetched',
                    payload: { user }
                })
            )
            .catch(err =>
                res.json({
                    success: false,
                    message: err.message,
                    error: err
                })
            );
    });

    return userRouter;
};
