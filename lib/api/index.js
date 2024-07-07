const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({origin: true}));
app.set('trust proxy', true);

require('dotenv').config();

app.get(`${api_string}base`, async(req, res)=>{
    console.log("At the Base of my API");

});

app.get(`${api_string}fetch/all_mobile_projects`, async (req, res)=>{
    console.log("Within the fetch all mobile projects endpoint");
});

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