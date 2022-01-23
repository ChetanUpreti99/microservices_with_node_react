const express = require('express');
const { randomBytes } = require('crypto');
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];


    comments.push({ id: commentId, content, status: 'PENDING' });

    commentsByPostId[req.params.id] = comments;

    await axios.post("http://event-bus-srv:4005/events", {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'PENDING'
        }
    })

    res.status(201).send(comments);
});


app.post('/events', async (req, res) => {
    if (req.body.type === 'CommentModerated') {
        const { id, postId, content, status } = req.body.data;
        console.log(commentsByPostId, 'commentsByPostId');
        const comment = commentsByPostId[postId].find((comment) => comment.id == id);
        comment.status = status;
        await axios.post("http://event-bus-srv:4005/events", {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                postId,
                status
            }
        })
    }
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});