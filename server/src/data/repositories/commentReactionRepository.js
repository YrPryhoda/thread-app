import { CommentReactionModel, CommentModel, UserModel } from '../models/index';
import BaseRepository from './baseRepository';

class CommentReactionRepository extends BaseRepository {
  getCommentReaction(userId, commentId) {
    return this.model.findOne({
      group: [
        'commentReaction.id',
        'comment.id'
      ],
      where: { userId, commentId },
      include: [{
        model: CommentModel,
        attributes: ['id', 'userId']
      }]
    });
  }

  getLikers(commentId) {
    return this.model.findAll({
      where: { commentId, isLike: true },
      attributes: ['id'],
      include: [{
        model: UserModel,
        attributes: ['id', 'username']
      }]
    });
  }
}

export default new CommentReactionRepository(CommentReactionModel);
