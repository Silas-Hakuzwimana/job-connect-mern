const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const {
  addBookmark,
  getBookmarks,
  removeBookmark,
} = require('../controllers/bookmark.controller');

// POST /api/bookmarks
router.post('/', auth, addBookmark);

// GET /api/bookmarks
router.get('/', auth, getBookmarks);

// DELETE /api/bookmarks/:id
router.delete('/:id', auth, removeBookmark);

module.exports = router;
