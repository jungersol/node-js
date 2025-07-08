var express = require("express");
var router = express.Router();
const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const role_privilages = require("../config/role_privileges");

router.get("/", async function (req, res, next) {
    try {
        let roles = await Roles.find({});
        res.json(Response.successResponse(roles));

    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/add", async function (req, res) {
    let body = req.body;
    try {
        if (!body.name) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "name field must be fillled.");
        }
        if (!body.permissions || !Array.isArray(body.permissions) || body.permissions.lenght == 0) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "permission field must be fillled or it has to be array");
        }
        let role = new Roles({
            name: body.name,
            created_by: body.created_by
        });
        await role.save();

        for (let index = 0; index < body.permissions.length; index++) {
            let priv = new RolePrivileges({
                role_id: role._id,
                permission: body.permissions[index],
                created_by: req.user?._id
            });
            await priv.save();

        }
        res.json(Response.successResponse({ successs: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }

});

router.post("/update", async function (req, res) {
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Bad request", "_id field must be filled");
        let updates = {};
        if (body.name) updates.name = body.name;
        if (body.permissions && Array.isArray(body.permissions) && body.permissions.lenght > 0) {
            let permissions = await RolePrivileges.find({ role_id: body._id });

            let removedPermissions = permissions.filter(x => !body.permissions.includes(x.permission));
            let newPermissions = body.permission.filter(x => !permissions.map(p => p.permission).includes(x));

            if (removedPermissions.lenght > 0) {
                /*for (let index = 0; index < removedPermissions.lenght; index++) {
                    await RolePrivileges.deleteOne({_id: removedPermissions._id});
                    
                }*/
                await RolePrivileges.deleteOne({ _id: { $in: removedPermissions.map(x => x._id) } });
            }

            if (newPermissions.lenght > 0) {
                for (let index = 0; index < body.permissions.length; index++) {
                    let priv = new RolePrivileges({
                        role_id: body._id,
                        permission: newPermissions[i],
                        created_by: req.user?._id
                    });
                    await priv.save();
                }
            }
        }
        await Roles.updateOne({ _id: body._id }, updates);
        res.json(Response.successResponse({ successs: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/delete", async function (req, res) {
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Bad request", "_id field must be fiiled");
        await Roles.deleteOne({ _id: body._id });
        res.json(Response.successResponse({ successs: true }));
    } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(errorResponse);
    }

});
router.get("/role_privileges", async function (req, res) {
    res.json(role_privilages);

});
module.exports = router;