const AppService = require("../services/app.service");

const AppController = {
    async getRewards(req, res) {
        const rewards = await AppService.getRewards();
        return res.status(200).send({rewards});
    }
}

module.exports = AppController;