import { CommentModel, UserModel, ImageModel, CommentReactionModel } from '../models/index';
import BaseRepository from './baseRepository';

class CommentRepository extends BaseRepository {
  getCommentById(id) {
    return this.model.findOne({
      group: [
        'comment.id',
        'user.id',
        'user->image.id'
      ],
      where: { id },
      include: [{
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: CommentReactionModel,
        attributes: ['id', 'commentId', 'userId']
      }]
    });
  }
}

export default new CommentRepository(CommentModel);
