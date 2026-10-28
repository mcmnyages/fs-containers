const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const current = await  redis.get('added_todos')
  console.log('Current before 0 or setting it to 0')
  const count = Number(current) || 0
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  console.log('Hitting the post and testing the redis', todo)
  await redis.set('added_todos', count +1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  req.todo.text = req.body.text ?? req.todo.text;
  req.todo.done = req.body.done ?? req.todo.done;

  await req.todo.save();

  res.send(req.todo);
});


router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
