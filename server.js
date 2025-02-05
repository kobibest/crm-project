const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', apiRouter);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
