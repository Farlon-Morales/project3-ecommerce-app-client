import React, { useEffect, useState, useContext } from "react";
import api from "../data/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

// ℹ️ Props:
// - productId: string (required)
// - isOwner: boolean (to hide the create form for the owner; backend already blocks it)
function ReviewCard({ productId, isOwner }) {
  const { isLoggedIn, user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [msg, setMsg] = useState("");

  // ℹ️ Create form (all fields optional, but at least one required server-side)
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ℹ️ Edit state
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // ℹ️ Load reviews
  useEffect(() => {
    api
      .get(`/products/${productId}/reviews`)
      .then(({ data }) => setReviews(data))
      .catch((e) =>
        setMsg(e.response?.data?.message || "Failed to load reviews")
      );
  }, [productId]);

  // ℹ️ Helpers
  const canManage = (r) =>
    isLoggedIn && user && r.author && r.author._id === user._id;

  // ℹ️ Create
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = {};
      if (rating !== "") payload.rating = Number(rating);
      if (comment.trim() !== "") payload.comment = comment.trim();
      if (imageUrl.trim() !== "") payload.imageUrl = imageUrl.trim();

      const { data } = await api.post(
        `/products/${productId}/reviews`,
        payload
      );
      setReviews((rs) => [data, ...rs]);
      setRating("");
      setComment("");
      setImageUrl("");
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to post review");
    }
  };

  // ℹ️ Begin edit
  const startEdit = (r) => {
    setEditingId(r._id);
    setEditRating(r.rating ?? "");
    setEditComment(r.comment ?? "");
    setEditImageUrl(r.imageUrl ?? "");
  };

  // ℹ️ Save edit
  const saveEdit = async () => {
    try {
      const update = {};
      if (editRating !== "") update.rating = Number(editRating);
      if (editComment !== "") update.comment = editComment;
      if (editImageUrl !== "") update.imageUrl = editImageUrl;
      // allow clearing comment/imageUrl by sending empty string
      if (editComment === "") update.comment = "";
      if (editImageUrl === "") update.imageUrl = "";

      const { data } = await api.patch(`/reviews/${editingId}`, update);
      setReviews((rs) => rs.map((r) => (r._id === editingId ? data : r)));
      setEditingId(null);
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to update review");
    }
  };

  // ℹ️ Delete
  const remove = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((rs) => rs.filter((r) => r._id !== id));
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <section className="reviews">
      <h3>Reviews</h3>

      {/* ℹ️ Create form (hidden for owner; backend enforces too) */}
      {isLoggedIn && !isOwner && (
        <form onSubmit={submit} className="review-form">
          <label>
            Rating (optional 1–5)
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </label>
          <textarea
            placeholder="Write a comment (optional)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <input
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button type="submit">Post review</button>
        </form>
      )}

      {msg && <div className="error-message">{msg}</div>}

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r._id} className="review-item">
            {editingId === r._id ? (
              <div className="review-edit">
                <label>
                  Rating (optional 1–5)
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                  />
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
                <input
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="Image URL (optional)"
                />
                <button type="button" onClick={saveEdit}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {r.rating != null && <strong>Rating: {r.rating}/5</strong>}
                {r.comment && <p>{r.comment}</p>}
                {r.imageUrl && (
                  <img src={r.imageUrl} alt="" className="review-image" />
                )}
                <small>
                  {r.author?.name ? `by ${r.author.name}` : ""} •{" "}
                  {new Date(r.createdAt).toLocaleString()}
                </small>
                {canManage(r) && (
                  <div className="review-actions">
                    <button type="button" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(r._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReviewCard;