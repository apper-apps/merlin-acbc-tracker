import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-autosize-textarea';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';
import { feedbackService } from '@/services/api/feedbackService';

const FeedbackThread = ({ reportId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'supervisor',
    avatar: 'SJ'
  };

  useEffect(() => {
    loadFeedbacks();
  }, [reportId]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await feedbackService.getByReportId(reportId);
      setFeedbacks(data);
    } catch (err) {
      setError('Failed to load feedback');
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const feedbackData = {
        reportId,
        userId: currentUser.id,
        userRole: currentUser.role,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newComment.trim(),
        parentId: null
      };

      await feedbackService.create(feedbackData);
      await loadFeedbacks();
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const feedbackData = {
        reportId,
        userId: currentUser.id,
        userRole: currentUser.role,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: replyText.trim(),
        parentId
      };

      await feedbackService.create(feedbackData);
      await loadFeedbacks();
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply added successfully');
    } catch (err) {
      toast.error('Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;

    setSubmitting(true);
    try {
      await feedbackService.update(id, { content: editText.trim() });
      await loadFeedbacks();
      setEditingId(null);
      setEditText('');
      toast.success('Comment updated successfully');
    } catch (err) {
      toast.error('Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await feedbackService.delete(id);
      await loadFeedbacks();
      toast.success('Comment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const startEditing = (feedback) => {
    setEditingId(feedback.Id);
    setEditText(feedback.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const startReplying = (feedbackId) => {
    setReplyingTo(feedbackId);
    setReplyText('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'supervisor':
        return 'bg-blue-500';
      case 'student':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFeedback = (feedback, isReply = false) => {
    const isEditing = editingId === feedback.Id;
    const isReplying = replyingTo === feedback.Id;
    const canEdit = feedback.userId === currentUser.id;
    const replies = feedbacks.filter(f => f.parentId === feedback.Id);

    return (
      <div key={feedback.Id} className={`${isReply ? 'ml-12' : ''}`}>
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full ${getRoleColor(feedback.userRole)} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
            {feedback.userAvatar}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{feedback.userName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(feedback.userRole)}`}>
                    {feedback.userRole}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(feedback.createdAt), 'MMM dd, yyyy • h:mm aa')}
                  </span>
                  {feedback.updatedAt !== feedback.createdAt && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => startEditing(feedback)}
                      className="text-gray-500 hover:text-gray-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(feedback.Id)}
                      className="text-gray-500 hover:text-red-600"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              {isEditing ? (
                <div className="space-y-3">
                  <TextareaAutosize
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Edit your comment..."
                    minRows={2}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(feedback.Id)}
                      disabled={submitting || !editText.trim()}
                      loading={submitting}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-900 whitespace-pre-wrap">{feedback.content}</p>
                  {!isReply && (
                    <div className="flex items-center space-x-4 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Reply"
                        onClick={() => startReplying(feedback.Id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reply Form */}
            {isReplying && (
              <div className="mt-3 ml-3">
                <div className="flex space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getRoleColor(currentUser.role)} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <TextareaAutosize
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Write a reply..."
                      minRows={2}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(feedback.Id)}
                        disabled={submitting || !replyText.trim()}
                        loading={submitting}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelReply}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {replies.map(reply => renderFeedback(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const topLevelFeedbacks = feedbacks.filter(f => !f.parentId);

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Feedback & Discussion</h2>
        <Loading />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Feedback & Discussion</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="MessageCircle" className="w-4 h-4" />
          <span>{feedbacks.length} {feedbacks.length === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex space-x-3">
          <div className={`w-10 h-10 rounded-full ${getRoleColor(currentUser.role)} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <TextareaAutosize
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a comment or feedback..."
              minRows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role}
                </span>
                <span>Commenting as {currentUser.name}</span>
              </div>
              <Button
                type="submit"
                disabled={submitting || !newComment.trim()}
                loading={submitting}
                icon="Send"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Feedback List */}
      {topLevelFeedbacks.length > 0 ? (
        <div className="space-y-6">
          {topLevelFeedbacks.map(feedback => renderFeedback(feedback))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ApperIcon name="MessageCircle" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No feedback yet. Be the first to add a comment!</p>
        </div>
      )}
    </Card>
  );
};

export default FeedbackThread;