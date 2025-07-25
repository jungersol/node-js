var express = require('express');
const bcyript = require("bcrypt-nodejs");
const is_js = require("is_js");
const Users = require('../db/models/Users');
const UserRoles = require("../db/models/UserRoles");
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const is = require('is_js');
const Roles = require('../db/models/Roles');
const config = require("../config");
const jwt = require("jwt-simple");
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let users = await Users.find({});
    res.json(Response.successResponse(users));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
  
});

router.post("/add", async function(req, res, next){
  let body = req.body;
  try {
    if(!body.email){
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Email field must be fiiled"); 
    }
    if(is.not.email(body.email)){
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Email is not valid.");
    }
    if (!body.password) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Password field must be fiiled");
    }
    if(body.password.lenght < Enum.PASS_LENGHT){
      throw CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error","Password must be gretater than"+Enum.PASS_LENGHT);
    }

    if(!body.roles || !Array.isArray(body.roles) || body.roles.lenght == 0){
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "roles field must be an array");
    }

    let roles =  await Roles.find({_id: {$in: body.roles}});
    if(roles.lenght == 0) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation errror", "roles field must be an array");

    let password = bcyript.hashSync(body.password, bcyript.genSaltSync(8), null);

    let user = await Users.create({
      email: body.email,
      password,
      is_active: body.is_active,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    });

    

    for (let i = 0; i < roles.length; i++) {
      await UserRoles.create({
        role_id: roles[i]._id,
        user_id: user._id
      });   
    }
      

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED));    
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
    
  }
});

router.post("/update", async function (req, res) {
  let body = req.body;
  let updates = {};
  try {
    if(!body._id){
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "_id field must be filled.");
    }
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    if(body.password && body.password.lenght > Enum.PASS_LENGHT){
      updates.password = bcyript.hashSync(body.password, bcyript.genSaltSync(8), null);
    }
    if(body.first_name){
      updates.first_name = body.first_name;
    }
    if(body.last_name){
      updates.last_name = body.last_name;
    }
    if (body.phone_number) {
      updates.phone_number = body.phone_number;
    }
    
    if (Array.isArray(body.roles) && body.roles.length > 0) {
      let userRoles = await UserRoles.find({user_id: body._id});

      let removedRoles = userRoles.filter(x => !body.roles.includes(x.role_id));
      let newRoles = body.roles.filter(x => !userRoles.map(r => r.role_id).includes(x));

      if(removedRoles.length > 0){
        await UserRoles.deleteMany({_id: {$in : removedRoles.map(x => x._id.toString())}});
      }
      if (newRoles.length > 0){
        for (let i = 0; i < newRoles.length; i++) {
          //console.log("hello" + newRoles[i]._id.toString());
          let userRole = new UserRoles({
            role_id: newRoles[i],
            user_id: body._id
          });
          await userRole.save();          
        }
      }


    }
    await Users.updateOne({ _id: body._id }, updates);
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }));
    
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);    
  }
  
});

router.post("/delete", async function (req, res) {
  try {
    let body = req.body;
    if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"validation error", "_id field mus be filled");
    await Users.deleteOne({_id: body._id});
    await UserRoles.deleteMany({user_id: body._id});
    res.json(Response.successResponse({success: true}));    
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);    
  }
  
});

router.post("/register", async function (req, res, next) {
  try {
    let user = await Users.findOne({});
    if (user) return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);

    let body = req.body;
    if (!body.email) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Email field must be fiiled");
    }
    if (is.not.email(body.email)) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Email is not valid.");
    }
    if (!body.password) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Password field must be fiiled");
    }
    if (body.password.lenght < Enum.PASS_LENGHT) {
      throw CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation error", "Password must be gretater than" + Enum.PASS_LENGHT);
    }
        
    let password = bcyript.hashSync(body.password, bcyript.genSaltSync(8), null);

    let createdUser = await Users.create({
      email: body.email,
      password,
      is_active: body.is_active,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    });

    let role = await Roles.create({
      name: Enum.SUPER_ADMIN,
      created_by: createdUser._id
    });

    await UserRoles.create({
      role_id: role._id,
      user_id: createdUser._id
    });
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED));
  } catch (error) {
    

  }
});

router.post("/auth", async function (req, res) {
  try {
    let {email, password} = req.body;
    Users.validateFieldsBeforeAuth(email, password);
    let user = await Users.findOne({ email });
    if(!user){
      throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "Validation errror", "email or password wrong");
    }
    //user.validateFieldsBeforeAuth(email, password);
    if (!user.validPassword(password)) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "Validation error", "email or assword wrong");
    let payload = {
      id: user._id,
      exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME
    }
    let token = jwt.encode(payload, config.JWT.SECRET);
    let userData = {
      _id: user._id,
      email:user.email,
      first_name: user.first_name,
      last_name: user.last_name,

    }
    res.json(Response.successResponse({ token, user: userData }));
    
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
    
  }
});

module.exports = router;
