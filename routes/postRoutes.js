const express = require('express');
const { getAllPosts, 
        createPost, 
        updatePost, 
        deletePost, 
        getCreate, 
        getPost, 
        getEdit 
    } = require('../Controllers/postsController');
const router = express.Router();

router.get('/create', getCreate);
router.get('/:id', getPost);
router.get('/edit/:id', getEdit);

router.get('/', getAllPosts);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
