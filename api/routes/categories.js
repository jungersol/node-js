var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require("../lib/Auditlogs");
const logger = require("../lib/logger/LoggerClass");

router.get('/', async function (req, res, next) {
    //res.send("deneme");
    try {
        let categories = await Categories.find({});
        res.json(Response.successResponse(categories));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/add', async (req, res) => {
    let body = req.body;
    try {
        if(!body.name){
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error.", "name field must be fillled.");
        }
        let category = new Categories({
            name: body.name,
            is_active: true,
            created_by: req.user?.id
        });

        await category.save();
        AuditLogs.info(req.user?.email, "Categories", "Add", category);
        logger.info(req.user?.email, "Categories", "Add", category);
        res.json(Response.successResponse({ successs: true }));
    } catch (error) {
        logger.error(req.user?.email, "Categories", "Add", error);
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
    
});

router.post('/update', async function(req, res){
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error.", "_id field must be fillled.");
        let updates = {};
        if(body.name) updates.name = body.name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
        await Categories.updateOne({_id: body._id}, updates);
        AuditLogs.info("Categories", "Update", { _id: body._id, updates });
        res.json(Response.successResponse({ successs: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);      
    }
});
router.post('/delete', async (req, res) => {
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error.", "_id field must be fillled.");
        await Categories.deleteOne({ _id: body._id });
        AuditLogs.info("Categories", "Delete", {_id: body._id});
        res.json(Response.successResponse({ successs: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse); 
    }
    
});

module.exports = router;