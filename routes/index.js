const bodyParser = require("body-parser");
const AppController = require("../controllers/app.controller");

const registerRoutes = app => {
    app.get('/api/rewards', bodyParser.json(), AppController.getRewards);
}

module.exports = {
    registerRoutes
}