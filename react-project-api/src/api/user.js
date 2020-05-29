const { Router } = require('express');
const otp = require('../libs/otp');

const User = require('../models/User');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        
        res.json(users);
    } catch (error) {
        next(error)
    }
});

router.post('/otp', (req, res, next) => {
    try {
        const mobileNumber = req.body.mobileNumber;

        const requestId = otp.request(mobileNumber);
        console.log(requestId);
        
        res.json({ 
            requestId: requestId
        });
    } catch (error) {
        next(error)
    }
});

router.post('/otp/:requestId/', async (req, res, next) => {
    try {
        const requestId = req.params.requestId;
        const code = req.body.code;

        const isVerified = await otp.verify(requestId, code);

        res.json({
            verified: isVerified
        });
    } catch (error) {
        next(error)
    }
});

router.post('/otp/cancel/:requestId/', async (req, res, next) => {
    try {
        const requestId = req.params.requestId;

        const isVerified = await otp.cancel(requestId);

        res.json({
            verified: isVerified
        });
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        const createdUser = await user.save();
        
        res.json(createdUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const user = await User.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true
        });

        res.json(user);
    } catch (error) {
        if (error.name === 'ValidattionError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;