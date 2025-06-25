var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");


router.get('/', async function (req, res, next) {
    try {
        let categories = await Categories.find({});
        res.json(Response.successResponse(categories));
    } catch (error) {
        res.json(Response.errorResponse(error));
    }
});

module.exports = router;