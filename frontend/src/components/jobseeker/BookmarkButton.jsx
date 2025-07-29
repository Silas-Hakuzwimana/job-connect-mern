import axios from 'axios';
import { useState } from 'react';

function BookmarkButton({ itemId, itemType }) {
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await axios.delete(`/api/bookmarks/${itemId}`);
        setBookmarked(false);
      } else {
        await axios.post('/api/bookmarks', { itemId, itemType });
        setBookmarked(true);
      }
    } catch (err) {
      console.error('Bookmark error:', err.response?.data || err.message);
    }
  };

  return (
    <button onClick={toggleBookmark}>
      {bookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
    </button>
  );
}

export default BookmarkButton;
