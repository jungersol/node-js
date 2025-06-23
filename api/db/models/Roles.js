const mongoose = require("mongoose");
const schema = mongoose.Schema(
    {
        role_name: {type: String, required: true},
        is_active: {type: Boolean, required: true},
        created_by: {
            type: mongoose.SchemaType.ObjectID,
            required: true
        }
    },
    {
        versionKey: false,
        timeStapms:{
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

class Users extends mongoose.Model{

}

schema.loadClass(Users);
module.exports = mongoose.model("users", schema);
