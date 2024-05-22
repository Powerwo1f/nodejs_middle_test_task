const router = require("./routes");
const Server = require("./server");

const init = async () => {
    Server.init();
    router.registerRoutes(Server.app);

    await Server.up();
}

module.exports = {
    init
}