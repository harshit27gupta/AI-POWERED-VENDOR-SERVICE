const express = require("express");
const router = express.Router();
const { filterSearch } = require("../controllers/searchController");
const { aiSearchHandler } = require("../controllers/aiSearchController");

router.get("/filter", filterSearch);
router.post("/ai", aiSearchHandler); // AI query in body

module.exports = router;
