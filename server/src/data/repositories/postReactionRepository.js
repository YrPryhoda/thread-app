import { PostReactionModel, PostModel, UserModel } from '../models/index';
import BaseRepository from './baseRepository';

class PostReactionRepository extends BaseRepository {
  getPostReaction(userId, postId) {
    return this.model.findOne({
      group: [
        'postReaction.id',
        'post.id'
      ],
      where: { userId, postId },
      include: [{
        model: PostModel,
        attributes: ['id', 'userId']
      }]
    });
  }

  getLikers(postId) {
    return this.model.findAll({
      where: { postId, isLike: true },
      attributes: ['id'],
      include: [{
        model: UserModel,
        attributes: ['id', 'username']
      }]
    });
  }
}

export default new PostReactionRepository(PostReactionModel);
