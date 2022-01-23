const express = require('express');
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});



app.post('/events', (req, res) => {
    const { type, data } = req.body;
    _handleEvent(type, data);
    res.send({});
});

const _handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        posts[data.id] = {
            ...data,
            comments: []
        }
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        posts[postId].comments.push({
            id,
            content,
            status
        });
    }

    if (type === 'CommentUpdated') {
        const { id, postId, status, content } = data;
        const comment = posts[postId].comments.find((comment) => comment.id == id);
        comment.status = status;
        comment.content = content;
    }
}

app.listen(4002, async () => {
    console.log('Listening on port 4002');
    let res = [];
    res = await axios.get("http://event-bus-srv:4005/events")
        .catch((err) => {
            console.log(err.message);
        });
    if (res && res.data) {
        for (let event of res.data) {
            _handleEvent(event.type, event.data);
        }
    }

});