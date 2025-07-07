const mongoose = require("mongoose");
const RolePrivileges = require("./RolePrivileges");
const schema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false
        }
    },
    {
        versionKey: false,
        timestamps:{
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

class Roles extends mongoose.Model{
    async deleteOne(query){
        if(query._id){
            await RolePrivileges.deleteOne({ role_id: query._id });
        }
        await super.deleteOne(query);
    }

}

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);
