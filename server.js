const port = 3001;
const express = require("express");

const Server = {
    app: null,

    init() {
        this.app = express();
        this.app.use(express.json());
    },

    async up() {
        this.app.listen(port, () => {
            console.log(`Proxy server is running on port ${port}`);
        });
    },
};
module.exports = Server;
