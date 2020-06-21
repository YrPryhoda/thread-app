import sequelize from '../db/connection';
import {
  PostModel,
  CommentModel,
  UserModel,
  ImageModel,
  PostReactionModel
} from '../models/index';
import BaseRepository from './baseRepository';

const { Op } = require('sequelize');

const likeCase = (bool, model) => `CASE WHEN "${model}"."isLike" = ${bool} THEN 1 ELSE 0 END`;
const dislikeCase = (bool, model) => `CASE WHEN "${model}"."isDislike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
  async getPosts(filter) {
    const {
      from: offset,
      count: limit,
      userId,
      filterId,
      showLiked
    } = filter;
    const where = {};
    if (userId) {
      Object.assign(where, { userId });
    }
    if (filterId) {
      Object.assign(where, {
        userId: {
          [Op.ne]: filterId
        }
      });
    }
    return this.model.findAll({
      where,
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true, 'postReactions'))), 'likeCount'],
          [sequelize.fn('SUM', sequelize.literal(dislikeCase(true, 'postReactions'))), 'dislikeCount']
        ]
      },
      include: [{
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: PostReactionModel,
        attributes: [],
        where: showLiked ? {
          userId: showLiked,
          isLike: true
        } : null,
        duplicating: false
      }],
      group: [
        'post.id',
        'image.id',
        'user.id',
        'user->image.id'
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
  }

  getPostById(id) {
    return this.model.findOne({
      group: [
        'post.id',
        'comments.id',
        'comments->user.id',
        'comments->user->image.id',
        'user.id',
        'user->image.id',
        'image.id'
      ],
      where: { id },
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true, 'postReactions'))), 'likeCount'],
          [sequelize.fn('SUM', sequelize.literal(dislikeCase(true, 'postReactions'))), 'dislikeCount']
        ]
      },
      include: [{
        model: CommentModel,
        include: [{
          model: UserModel,
          attributes: [
            'id',
            'username',
            'status'
          ],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        }]
      }, {
        model: UserModel,
        attributes: ['id', 'username', 'status', 'email'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: PostReactionModel,
        attributes: []
      }]
    });
  }
}

export default new PostRepository(PostModel);
