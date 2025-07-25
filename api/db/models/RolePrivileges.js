const mongoose = require("mongoose");
const schema = mongoose.Schema(
    {
        role_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        permission: {type: String},
        cretaed_by: {
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

class RolePriviliges extends mongoose.Model{

}

schema.loadClass(RolePriviliges);
module.exports = mongoose.model("role_priviliges", schema);
