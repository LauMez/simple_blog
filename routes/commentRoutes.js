const express = require('express');
const { createComment, 
        getCommentsByPost 
    } = require('../Controllers/commentsController');
const router = express.Router();

router.post('/:post_id/comments', createComment);
router.get('/:post_id/comments', getCommentsByPost);

module.exports = router;
