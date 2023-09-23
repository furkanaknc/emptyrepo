const express = require('express');
const passport = require('passport');
const adminController = require('../../controllers/user');
const humanOperations = require('../../controllers/human');

const router = express.Router();


router.post('/register', adminController.registerUser);
router.post('/login', adminController.loginUser);
router.get('/profile', passport.authenticate('jwt', { session: false }), adminController.getUserProfile);

router.post('/setRelation',passport.authenticate('jwt', { session: false }),humanOperations.setRelation);
router.put('/updateRelation',passport.authenticate('jwt', { session: false }), humanOperations.updateRelation);
router.delete('/deleteHuman',passport.authenticate('jwt', { session: false }), humanOperations.deleteHuman);
router.get('/getHumans',passport.authenticate('jwt', { session: false }),humanOperations.getHumans);


module.exports = router;