import { Router } from 'express';
import * as commentService from '../services/commentService';

const router = Router();

router
  .get('/:id', (req, res, next) => commentService.getCommentById(req.params.id)
    .then(comment => res.send(comment))
    .catch(next))
  .post('/', (req, res, next) => commentService.create(req.user.id, req.body)
    .then(comment => res.send(comment))
    .catch(next))
  .put('/edit/:id', (req, res, next) => commentService.updateById(req.user.id, req.body)
    .then(comment => res.send(comment))
    .catch(next))
  .put('/react', (req, res, next) => commentService.setReaction(req.user.id, req.body)
    .then(comment => res.send(comment))
    .catch(next))
  .delete('/delete/:id', (req, res, next) => commentService.deleteById(req.params.id)
    .then(comment => res.send({ result: comment }))
    .catch(next));

export default router;
