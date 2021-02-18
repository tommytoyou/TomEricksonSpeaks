const express = require('express');
const db = require('../models');
const router = express.Router();

router.post('/', async function(req, res) {
    try{
        let comment = await db.comment.create(req.body)
        res.redirect(`/posts/${comment.postId}`)
    }catch(error) {
        console.log(error.message)
        res.status(400).render('main/404')
    }
})
module.exports = router