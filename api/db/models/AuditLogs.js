const mongoose = require("mongoose");
const schema = mongoose.Schema(
    {
        level: {type: String},
        email: { type: String, required: true },
        location : String,
        proc_type: String,
        log: String
    },
    {
        versionKey : false,
        timestapms:{
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

class AuditLogs extends mongoose.Model{

}

schema.loadClass(AuditLogs);
module.exports = mongoose.model("audit_logs", schema);
