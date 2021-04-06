const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const Message = require('../../models/jayMessage');
const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');
const jayMesaage = require('../../models/jayMessage');




router.use(function(req, res, next) {
    try {
        jwtUser = jwt.verify(verify(req), keys.secretOrKey);
        next();
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});


router.get('message',(req,res)=>{
const user=jwtUser.id
const to= req.query.id

try{
  
    const conversation=Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: user } },
                    { $elemMatch: { $eq: to } },
                ],},},
        {   recipients: [user, to],
            lastMessage: req.body.body,
            date: Date.now(),
         },
        { upsert: true, new: true, setDefaultsOnInsert: true },)
    
    const message=new jayMesaage({
        author:user,
        to:to,
        body:req.body.body,
        conversation: conversation._id,
        date: Date.now(),
    })
    message.save((err,message)=>{
        if(err){
            res.status(500).send(err)
        }
    res.status(200).send(message)
    });
    
}catch(err){

}



})