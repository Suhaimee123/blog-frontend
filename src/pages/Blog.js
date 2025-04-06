import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from '../config/axios';
import { AuthContext } from '../context/AuthContext';

const Blog = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null); // 🔧 ติดตามว่าแก้โพสต์ไหนอยู่

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get('/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      alert('Failed to fetch posts');
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePost = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        // 🔁 UPDATE POST
        const res = await axios.put(`/posts/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.map(post => post.id === editingId ? res.data.post : post));
        setEditingId(null); // ยกเลิกโหมดแก้ไข
      } else {
        // ✅ CREATE POST
        const res = await axios.post('/posts', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts([...posts, res.data]);
      }
      setForm({ title: '', content: '' });
    } catch (err) {
      alert('Failed to save post');
    }
  };

  const deletePost = async id => {
    try {
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch {
      alert('Failed to delete post');
    }
  };

  const startEditing = post => {
    setForm({ title: post.title, content: post.content });
    setEditingId(post.id);
  };

  const cancelEdit = () => {
    setForm({ title: '', content: '' });
    setEditingId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Blog Posts</h2>

      {user && (
        <form onSubmit={handlePost} className="mb-4">
          <div className="mb-3">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="content"
              placeholder="Content"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            {editingId ? 'Update Post' : 'Create Post'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn btn-secondary w-100 mt-2">
              Cancel
            </button>
          )}
        </form>
      )}

      {posts.length === 0 && <p className="text-center">No posts yet.</p>}

      <div className="row">
        {posts.map(post => (
          <div className="col-md-6 mb-4" key={post.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.content}</p>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <small className="text-muted">By {post.author}</small>
                {user?.username === post.author && (
                  <div className="btn-group">
                    <button
                      onClick={() => startEditing(post)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
