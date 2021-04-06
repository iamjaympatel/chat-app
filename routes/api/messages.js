const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');
const JayMessage = require('../../models/jayMessage')
const User = require("../../models/User");


let jwtUser = null;

// Token verfication middleware
router.use(function(req, res, next) {
//    const auth=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(' ')[1];

        jwtUser = jwt.verify(token, keys.secretOrKey);
        req.user=jwtUser
        next();
    } catch (err) {
        console.log(err);
        
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});


// Get global messages
router.get('/global', async(req, res) => {
   
    await GlobalMessage.find({ })
    .populate('author','_id username name')
    .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

// Post global message

router.post('/global', async(req, res) => {
    let message = new GlobalMessage({
        author: jwtUser.id,
        body: req.body.body,
    });
    const author=await User.findById(jwtUser.id).select('_id name username')
    
    let socketmessage = ({
        author: author,
        body: req.body.body,
    });

    req.io.sockets.emit('gmessages', socketmessage);

    message.save(err => {
        if (err) {
            console.log(err);
            res.end(JSON.stringify({ message: 'Failure' }));
            res.sendStatus(500);
        } else {
        
            res.end(JSON.stringify({ message: 'Success' }));
        }
    });
});

// Get conversations list
router.get('/conversations',async (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id);
  
    await Conversation.find({ recipients: {$in:[from]} })
    .populate('recipients','_id username name')
     .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});


// Get messages from conversation
// based on to & from
router.get('/conversations/:id', async(req, res) => {
   let user1 =jwtUser.id;
    let user2 = req.params.id;
   // let user=req.user.id

await JayMessage.find({  $or: [
    { $and: [{ to: user1 }, { author: user2 }] },
    { $and: [{ to: user2 }, { author: user1 }] },
] 
}).populate('author','_id username name')
.populate('to','_id username name')
.exec((err, messages) => {
            if (err) {
                console.log(err);
               
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
});

});


router.post('/',async(req, res) => {
    let user = mongoose.Types.ObjectId(jwtUser.id);
    let to = mongoose.Types.ObjectId(req.body.to);    
    //  let user=req.user.id  
    
    const author=await User.findById(user).select('_id name username')
    const touser=await User.findById(to).select('_id name username')
    
    const receiver=[author._id,touser._id]
    const conversation= await Conversation.findOneAndUpdate(
                        {
                            recipients: {
                                $all: [
                                    { $elemMatch: { $eq: user } },
                                    { $elemMatch: { $eq: to } },
                                ],
                            },
                        },
                        {
                            recipients: [jwtUser.id, req.body.to],
                            lastMessage: req.body.body,
                            date: Date.now(),
                        },
                        { upsert: true, new: true, setDefaultsOnInsert: true },)

                        
                                let message = new JayMessage({
                                    conversation: conversation._id,
                                    to: req.body.to,
                                    author: jwtUser.id,
                                    body: req.body.body,
                                });
                
                                
                                let socketmessage = ({
                                    conversation: conversation._id,
                                    to: touser,
                                    author: author,
                                    body: req.body.body,
                                });
                               
                               
                            //    req.io.sockets.in(to).emit('messages', socketmessage);
                               
                            req.io.sockets.in(author._id).emit('messages', socketmessage);
                                   
                                req.io.sockets.in(touser._id).emit('messages', socketmessage);
                                                                 
                                 message.save((err,msg) => {
                                    if (err) {
                                        console.log(err);
                                        res.setHeader('Content-Type', 'application/json');
                                        res.end(JSON.stringify({ message: 'Failure' }));
                                        res.sendStatus(500);
                                    } else {
                                        res.setHeader('Content-Type', 'application/json');
                                        res.end(
                                            JSON.stringify({
                                                message: 'Success',
                                                conversationId: conversation._id,
                                                  })

                                        );

                                    }
                                }); 
                            })
        



module.exports = router;
