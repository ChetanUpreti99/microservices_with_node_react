const express = require('express');
const axios = require("axios");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.post('/events', async (req, res) => {
    console.log(`Received Event`, req.body);
    if (req.body.type === 'CommentCreated') {
        let { id, content, postId, status } = req.body.data;
        status = content.includes('orange') ? 'REJECTED' : 'APPROVED';

        await axios.post("http://event-bus-srv:4005/events", {
            type: 'CommentModerated',
            data: {
                id: id,
                content,
                postId: postId,
                status: status
            }
        })
    }
    res.status(201).send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});