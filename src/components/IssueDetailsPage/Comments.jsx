import React, { useState } from "react";
import { formatDate} from "../../utils/formatDate";
import { parseJiraMarkup } from "../../utils/parseJiraMarkup";
 
const getInitials = (name = "") => {
  if (!name) return "?";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
 
const Comments = ({ comments }) => {
    const[showMoreComments,setShowMoreComments] = useState(false)
 
  if (!comments.length) {
    return (
      <div className="mt-6 text-gray-500 text-sm">
        No comments available
      </div>
    );
  }
 
  return (
    <div className="mt-6">
      {/* Comments list */}
      <div className="space-y-4">
        {comments.slice(0,4).map((comment, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Profile circle */}
            <div className="shrink-0">
              {<button className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center">
                {getInitials(comment.userName)}
              </button> }
            </div>
 
            {/* Comment content */}
            <div className="flex flex-col">
              {/* Username */}
              <span className="text-sm font-semibold text-gray-800">
                {comment.userName}
              </span>
 
              {/* Time */}
              <span className="text-xs text-gray-500">
                {formatDate(comment.commentDate)}
              </span>
 
              {/* Comment text */}
                <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {parseJiraMarkup(comment.commentText)}
                </p>
 
            </div>
          </div>
        ))}
        {
          comments.length>4 && !showMoreComments &&
          (<button className="w-full p-2 border-2 rounded border-gray-500 text-sm" onClick={()=>{setShowMoreComments(true)}}>Show More Comments</button>)
        }
        {
          showMoreComments && comments.slice(4).map((comment, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Profile circle */}
            <div className="shrink-0">
              {<button className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center">
                {getInitials(comment.userName)}
              </button> }
            </div>
 
            {/* Comment content */}
            <div className="flex flex-col">
              {/* Username */}
              <span className="text-sm font-semibold text-gray-800">
                {comment.userName}
              </span>
 
              {/* Time */}
              <span className="text-xs text-gray-500">
                {formatDate(comment.commentDate)}
              </span>
 
              {/* Comment text */}
                <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {parseJiraMarkup(comment.commentText)}
                </p>
 
            </div>
          </div>
        ))}
 
        {showMoreComments && (
          (<button className="w-full p-2 border-2 rounded border-gray-500 text-sm" onClick={()=>{setShowMoreComments(false)}}>Show Less</button>)
        )}
      </div>
    </div>
  );
};
 
export default Comments;
 