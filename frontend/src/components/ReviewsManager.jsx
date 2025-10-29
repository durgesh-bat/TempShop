import React, { useState, useEffect } from "react";
import { getReviews, deleteReview } from "../api/profileApi";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this review?")) {
      await deleteReview(id);
      loadReviews();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{review.product?.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(review.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
              {review.comment && <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
