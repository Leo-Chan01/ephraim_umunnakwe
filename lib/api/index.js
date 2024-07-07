const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({origin: true}));
app.set('trust proxy', true);

require('dotenv').config();

app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: "The Endpoint you requested doesn't exist. Contact the dev if you're not the owner"
    });
});

let PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("app listening in http://localhost:" + PORT);
});

module.exports = app;