const express = require('express');
const { sequelize, User, Post } = require('./models');

const app = express();
app.use(express.json());
app.post('/users', async (req,res) => {
  const {name, email, role} = req.body;
  try{
    const user = await User.create({
      name,
      email,
      role
    })
    return res.json(user);
  }catch(err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

app.get('/users', async (req,res) => {
  try {
    const users = await User.findAll({include: 'posts'});
    return res.json(users);
  }catch(err) {
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
})

app.get('/users/:uuid', async (req,res) => {
  const uuid = req.params.uuid;
  try {
    
    const user = await User.findOne({uuid, include: ['posts']});
    return res.json(user);
  }catch(err) {
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
})

app.get('/posts', async (req,res) => {
  try {
    const posts = await Post.findAll({include: ['user']});

    return res.json(posts);
  }catch(err) {
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
})

app.post('/posts', async (req,res) => {
  try{
    const {userUuid, body} = req.body;
    const user = await User.findOne({where: {uuid: userUuid}});
    const post = await Post.create({body: body, userId: user.id})
    return res.status(200).json(post);
  }catch(err) {
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
})

app.delete('/users/:uuid', async (req,res) => {
  const uuid = req.params.uuid;
  try {
    const user = await User.findOne({uuid});
    await user.destroy();
    return res.json({
      message: "user deleted"
    });
  }catch(err) {
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
})

app.put('/users/:uuid', async (req,res) => {
  const uuid = req.params.uuid;
  const {name, email, role} = req.body;
  try {
    const user = await User.findOne({uuid});
    user.name = name;
    user.email = email;
    user.role = role;
    user.save();
    return res.json(user);
  }catch(err) {
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
})


app.listen({port: 5000}, async () => {
  console.log('server listening on port 5000');
  await sequelize.authenticate()
  console.log('sequelize synced');
})
