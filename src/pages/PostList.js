import React, { useEffect, useState } from 'react';
import axios from '../config/axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts'); // ✅ ไม่ต้องมี token
      setPosts(res.data);
    } catch (err) {
      alert('Failed to fetch posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">All Blog Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center">No posts available.</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div className="col-md-6 mb-4" key={post.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                </div>
                <div className="card-footer">
                  <small className="text-muted">By {post.author}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
