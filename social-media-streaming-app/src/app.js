const express = require('express');
const bodyParser = require('body-parser');
const streamRoutes = require('./routes/streamRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/streams', streamRoutes());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});