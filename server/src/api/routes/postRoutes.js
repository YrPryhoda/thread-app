import { Router } from 'express';
import * as postService from '../services/postService';

const router = Router();

router
  .get('/', (req, res, next) => postService.getPosts(req.query)
    .then(posts => res.send(posts))
    .catch(next))
  .get('/:id', (req, res, next) => postService.getPostById(req.params.id)
    .then(post => res.send(post))
    .catch(next))
  .get('/likers/:postId', (req, res, next) => postService.getLikers(req.params.postId)
    .then(post => res.send(post))
    .catch(next))
  .post('/', (req, res, next) => postService.create(req.user.id, req.body)
    .then(post => {
      req.io.emit('new_post', post); // notify all users that a new post was created
      return res.send(post);
    })
    .catch(next))
  .put('/edit/:id', (req, res, next) => postService.editPostById(req.user.id, req.body)
    .then(post => res.send(post))
    .catch(next))
  .put('/react', (req, res, next) => postService.setReaction(req.user.id, req.body)
    .then(reaction => {
      if (reaction.post && (reaction.post.userId !== req.user.id)) {
        // notify a user if someone (not himself) liked his post
        req.io.to(reaction.post.userId).emit('like', 'Your post was liked!');
      }
      return res.send(reaction);
    })
    .catch(next))
  .put('/react-negative', (req, res, next) => postService.setReactionDislike(req.user.id, req.body)
    .then(reaction => {
      if (reaction.post && (reaction.post.userId !== req.user.id)) {
        // notify a user if someone (not himself) liked his post
        req.io.to(reaction.post.userId).emit('dislike', 'Your post was disliked!');
      }
      return res.send(reaction);
    })
    .catch(next))
  .delete('/delete/:id', (req, res, next) => postService.deleteById(req.params.id)
    .then(reaction => res.send({ result: reaction }))
    .catch(next));

export default router;
