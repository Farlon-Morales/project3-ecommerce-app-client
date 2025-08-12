// src/components/ReviewCard.jsx
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
    isLoggedIn && user && r.author && String(r.author._id) === String(user._id);

  // ℹ️ Determine if current user already has a review for this product
  const hasUserReview =
    isLoggedIn &&
    user &&
    reviews.some((r) => r.author && String(r.author._id) === String(user._id));

  // ℹ️ Create
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    // quick guard for malformed ids (avoids guaranteed 400)
    if (!/^[a-f0-9]{24}$/i.test(productId)) {
      setMsg("Invalid product id.");
      return;
    }

    try {
      const ratingProvided = rating !== "" && Number.isFinite(Number(rating));
      const commentProvided = comment.trim() !== "";
      const imageProvided = imageUrl.trim() !== "";

      // require at least one field (matches server rule)
      if (!ratingProvided && !commentProvided && !imageProvided) {
        setMsg("Provide rating, comment, or image URL.");
        return;
      }

      // rating bounds (matches server rule)
      if (ratingProvided) {
        const num = Number(rating);
        if (num < 1 || num > 5) {
          setMsg("Rating must be between 1 and 5.");
          return;
        }
      }

      // image url must be http(s)
      if (imageProvided && !/^https?:\/\/\S+$/i.test(imageUrl.trim())) {
        setMsg("Image URL must start with http:// or https://");
        return;
      }

      const payload = {};
      if (ratingProvided) payload.rating = Number(rating);
      if (commentProvided) payload.comment = comment.trim();
      if (imageProvided) payload.imageUrl = imageUrl.trim();

      const { data } = await api.post(
        `/products/${productId}/reviews`,
        payload
      );
      setReviews((rs) => [data, ...rs]);
      setRating("");
      setComment("");
      setImageUrl("");
      // After adding, hasUserReview becomes true and the form will auto-hide.
    } catch (e) {
      console.error("Post review error:", e.response?.status, e.response?.data);
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
    setMsg("");
    try {
      const ratingProvided =
        editRating !== "" && Number.isFinite(Number(editRating));
      const commentProvided =
        editComment !== null && editComment !== undefined;
      const imageProvided =
        editImageUrl !== null && editImageUrl !== undefined;

      // validate rating only if provided
      const update = {};
      if (ratingProvided) {
        const num = Number(editRating);
        if (num < 1 || num > 5) {
          setMsg("Rating must be between 1 and 5.");
          return;
        }
        update.rating = num;
      }

      // allow clearing comment/imageUrl by sending empty string
      if (commentProvided) update.comment = editComment;
      if (imageProvided) update.imageUrl = editImageUrl;

      // if nothing to update
      if (Object.keys(update).length === 0) {
        setMsg("No changes provided");
        return;
      }

      // if imageUrl provided (non-empty), validate scheme
      if (
        typeof update.imageUrl === "string" &&
        update.imageUrl.trim() !== "" &&
        !/^https?:\/\/\S+$/i.test(update.imageUrl.trim())
      ) {
        setMsg("Image URL must start with http:// or https://");
        return;
      }

      const { data } = await api.patch(`/reviews/${editingId}`, update);
      setReviews((rs) => rs.map((r) => (r._id === editingId ? data : r)));
      setEditingId(null);
    } catch (e) {
      console.error("Update review error:", e.response?.status, e.response?.data);
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
    <section className="card mt-4 w-100">
      <div className="card-body">
        <h3 className="h4 mb-3">Reviews</h3>

        {/* ℹ️ Create form (hidden for owner; backend enforces too) */}
        {/* ℹ️ Also hide when the logged-in user already has a review for this product */}
        {isLoggedIn && !isOwner && !hasUserReview && (
          <form onSubmit={submit} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Rating (optional 1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => {
                  const v = e.target.value;
                  // keep blank when empty; otherwise a clean integer string
                  setRating(v === "" ? "" : String(Math.floor(Number(v) || "")));
                }}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                placeholder="Write a comment (optional)…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL (optional)</label>
              <input
                className="form-control"
                placeholder="https://…"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Post review
            </button>
          </form>
        )}

        {/* ℹ️ Informative hint when user already reviewed */}
        {isLoggedIn && !isOwner && hasUserReview && (
          <div className="alert alert-info">
            You already reviewed this product. You can edit or delete your review below.
          </div>
        )}

        {msg && <div className="alert alert-danger">{msg}</div>}

        <ul className="list-group list-group-flush">
          {reviews.map((r) => (
            <li key={r._id} className="list-group-item">
              {editingId === r._id ? (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Rating (optional 1–5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editRating}
                      onChange={(e) => {
                        const v = e.target.value;
                        setEditRating(
                          v === "" ? "" : String(Math.floor(Number(v) || ""))
                        );
                      }}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL (optional)</label>
                    <input
                      className="form-control"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="btn btn-primary btn-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {r.rating != null && (
                    <strong className="me-2">Rating: {r.rating}/5</strong>
                  )}
                  {r.comment && <p className="mb-1">{r.comment}</p>}
                  {r.imageUrl && (
                    <img
                      src={r.imageUrl}
                      alt=""
                      className="img-fluid rounded mb-2"
                      style={{ maxWidth: 240 }}
                    />
                  )}
                  <small className="text-muted d-block">
                    {r.author?.name ? `by ${r.author.name}` : ""} •{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </small>
                  {canManage(r) && (
                    <div className="mt-2 d-flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(r)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r._id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ReviewCard;