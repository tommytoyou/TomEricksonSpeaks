const express = require('express');
const db = require('../models');
const { post } = require('./comment');
const router = express.Router();
// create a new 'post'
router.post('/', async function (req, res) {
    try {
        await db.post.create({
            title: req.body.title,
            genre: req.body.genre,
            content: req.body.content,
            userId: req.user.id
        })
        res.redirect('/')
    }   catch (error) {
        console.log(error.message)
        res.status
    }
})


router.post('/edit', async function(req, res){
    try{
        await db.post.update({
            title: req.body.title,
            genre: req.body.genre,
            content: req.body.content,
            userId: req.body.userId
        },{returning: true, where: {id: req.body.postID}})
        res.redirect(`/posts/${req.body.postID}`)
    }catch(error){
        console.log(error.message)
        res.status(400).render('main/404')
    }
})
// GET /posts/new display form for creating new posts
router.get('/new', async function(req, res){
    try{
        //db.post.findAll(
            res.render('posts/new', {users: await db.user.findAll() })
    }catch(error) {
        console.log(error.message)
        res.status(400).render('main/404')
    }
})

router.get('/edit/:id', async function(req, res){
    try{
        //let post
        res.render('posts/edit', { article: await db.post.findOne({
          where: {id: req.params.id } , 
          include: [db.user]
        })})
    }catch(error){
        console.log(error.message)
        res.status(400).render('main/404')
    }

})

// get /posts/:id - display a specific post and its user
router.get('/:id', async function(req, res){
    try{//this is my show.ejs i still have to build out the get route for blog chain
        let post = await db.post.findOne({
            where: { id: req.params.id },
            include: [db.user, db.comment] 
         })

        res.render('posts/show', {post: await db.post.findOne({
           where: { id: req.params.id },
           include: [db.user, db.comment] 
        }) })
    }catch(error) {
        console.log(error.message)
        res.status(400).render('main/404')
    }
})
router.post('/:id', async function(req, res) {
    try{
        let comment = await db.comment.create({
            name: req.body.name,
            userId: req.body.userId,
            postId: req.body.postId,
            comment: req.body.comment,
            include: [db.user, db.post] 
        })
        res.redirect(`/posts/${comment.postId}`)
    }catch(error) {
        res.status(400).render('main/404')
    }
})


module.exports = router