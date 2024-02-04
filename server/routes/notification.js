const router = require('express').Router();

// const store = require("../controller/notifications/store");
const getAll = require("../controller/notifications");
const destroy = require("../controller/notifications/destroy");

router.get('/:id', getAll);
router.delete("/:authUser", destroy);


module.exports = router;