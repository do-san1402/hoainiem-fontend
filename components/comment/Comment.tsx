"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import instance from "@/utils/instance";
import LikeIcon from "@/public/icons/LikeIcon";
import UnlikeIcon from "@/public/icons/UnlikeIcon";

interface Comment {
    id: number;
    user: { full_name: string };
    content: string;
    created_at_human: string;
    likes: number;
    isLikedByUser: boolean; // User's like status
    replies?: Comment[]; // Replies to the comment
    showReplyInput?: boolean; // Toggle for reply input
    replyText?: string; // Reply text state
    parent_id?: number | null; // Parent comment ID
}

interface Props {
    postId: number;
}

const fetcherWithAuth = (url: string, token: string) =>
    instance
        .get(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data);

const Comments: React.FC<Props> = ({ postId }) => {
    const [newComment, setNewComment] = useState("");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        setToken(storedToken);
    }, []);

    const { data, error, isLoading } = useSWR<{
        total_comments: number;
        comments: Comment[];
    }>(
        token ? [`/posts/${postId}/comments`, token] : null,
        ([url, token]) => fetcherWithAuth(url, token as string)
    );

    const allComments = data?.comments || [];
    const totalComments = data?.total_comments || 0;

    const parentComments = allComments.filter((comment) => !comment.parent_id);

    const handleAddComment = async () => {
        if (!token) {
            console.error("User is not authenticated.");
            return;
        }

        if (newComment.trim() === "") return;

        try {
            const response = await instance.post(
                "/comments",
                { id: postId, content: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            mutate(
                [`/posts/${postId}/comments`, token],
                {
                    total_comments: totalComments + 1,
                    comments: [response.data, ...allComments],
                },
                false
            );

            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleLike = async (id: number, isReply = false, commentId?: number) => {
        if (!token) return;

        try {
            const response = await instance.post(
                `/comments/${id}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedComments = allComments.map((comment) => {
                if (!isReply && comment.id === id) {
                    return {
                        ...comment,
                        likes: response.data.total_likes,
                        isLikedByUser: response.data.isLikedByUser,
                    };
                }

                if (isReply) {
                    const updatedReplies = comment.replies?.map((reply) =>
                        reply.id === id
                            ? {
                                ...reply,
                                likes: response.data.total_likes,
                                isLikedByUser: response.data.isLikedByUser,
                            }
                            : reply
                    );

                    return { ...comment, replies: updatedReplies };
                }

                return comment;
            });


            mutate(
                [`/posts/${postId}/comments`, token],
                {
                    total_comments: totalComments,
                    comments: updatedComments,
                },
                false
            );

        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };


    const toggleReplyInput = (commentId: number) => {
        const updatedComments = allComments.map((comment) =>
            comment.id === commentId
                ? { ...comment, showReplyInput: !comment.showReplyInput, replyText: "" }
                : comment
        );
        mutate(
            [`/posts/${postId}/comments`, token],
            {
                total_comments: totalComments,
                comments: updatedComments,
            },
            false
        );
    };

    const handleReplyTextChange = (commentId: number, text: string) => {
        const updatedComments = allComments.map((comment) =>
            comment.id === commentId ? { ...comment, replyText: text } : comment
        );
        mutate(
            [`/posts/${postId}/comments`, token],
            {
                total_comments: totalComments,
                comments: updatedComments,
            },
            false
        );
    };

    const handleReplySubmit = async (commentId: number) => {
        if (!token) return;

        const parentComment = allComments.find((comment) => comment.id === commentId);
        if (!parentComment || !parentComment.replyText?.trim()) return;

        try {
            const response = await instance.post(
                `/comments/${commentId}/reply`,
                { content: parentComment.replyText },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedComments = allComments.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), response.data],
                        showReplyInput: false,
                        replyText: "",
                    }
                    : comment
            );

            mutate(
                [`/posts/${postId}/comments`, token],
                {
                    total_comments: totalComments + 1,
                    comments: updatedComments,
                },
                false
            );
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p>Error loading comments</p>;

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">{totalComments} bình luận</h3>
            <div className="flex flex-col space-y-2 mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={2}
                />
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={() => setNewComment("")}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAddComment}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${newComment.trim()
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                        disabled={!newComment.trim()}
                    >
                        Bình luận
                    </button>
                </div>
            </div>

            <ul className="list-none p-0">
                {parentComments.map((comment) => (
                    <li key={comment.id} className="mb-5">
                        <div className="flex items-start gap-3">
                            {/* <img
                                src={comment.user.avatar || "/default-avatar.png"}
                                alt={comment.user.full_name}
                                className="w-10 h-10 rounded-full"
                            /> */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{comment.user.full_name}</span>
                                    <span className="text-xs text-gray-500">{comment.created_at_human}</span>
                                </div>
                                <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                                    >
                                        {comment.isLikedByUser ? (
                                            <LikeIcon />
                                        ) : (
                                            <UnlikeIcon />
                                        )}
                                        <span>{comment.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => toggleReplyInput(comment.id)}
                                        className="text-gray-600 hover:text-blue-500"
                                    >
                                        Phản hồi
                                    </button>
                                </div>
                                {comment.showReplyInput && (
                                    <div className="mt-4 flex gap-3 items-center                                    ">
                                        {/* <img
                                            src="/default-avatar.png"
                                            alt="Your Avatar"
                                            className="w-10 h-10 rounded-full"
                                        /> */}
                                        <textarea
                                            value={comment.replyText || ""}
                                            onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
                                            placeholder="Phản hồi..."
                                            className="flex-1 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                            rows={2}
                                        />
                                        <button
                                            onClick={() => toggleReplyInput(comment.id)}
                                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-md"
                                        >
                                            Hủy
                                        </button>

                                        <button
                                            onClick={() => handleReplySubmit(comment.id)}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${comment.replyText?.trim()
                                                ? "bg-blue-500 hover:bg-blue-600"
                                                : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                            disabled={!comment.replyText?.trim()}
                                        >
                                            Phản hồi
                                        </button>
                                    </div>
                                )}

                                <ul className="pl-12 mt-3 space-y-3">
                                    {comment.replies?.map((reply) => (

                                        <li key={reply.id} className="flex items-start gap-3">
                                            {/* <img
                                                src={reply.user.avatar || "/default-avatar.png"}
                                                alt={reply.user.full_name}
                                                className="w-8 h-8 rounded-full"
                                            /> */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{reply.user.full_name}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {reply.created_at_human}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-800 mt-1">{reply.content}</p>
                                                <button
                                                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 mt-2 text-sm"
                                                    onClick={() => handleLike(reply.id, true, comment.id)}
                                                >
                                                    {reply.isLikedByUser ? (
                                                        <LikeIcon />
                                                    ) : (
                                                        <UnlikeIcon />
                                                    )}
                                                    <span>{reply.likes}</span>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Comments;
