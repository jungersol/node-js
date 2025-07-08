module.exports = {
    privGroups:[
        {
            id: "USERS",
            name: "User Permissions"
        },
        {
            id: "ROLES",
            name: "User Permissions"
        },
        {
            id: "CATEGORIES",
            name: "User Permissions"
        },
        {
            id: "AUDITLOG",
            name: "User Permissions"
        }
    ],
    privileges:[
        {
            key: "user_view",
            name: "User View",
            group: "USERS",
            description: "User view"
        },
        {
            key: "user_add",
            name: "User Add",
            group: "USERS",
            description: "User add"
        },
        {
            key: "user_update",
            name: "User Update",
            group: "USERS",
            description: "User update"
        },
        {
            key: "user_delete",
            name: "User Delete",
            group: "USERS",
            description: "User delete"
        },
        {
            key: "role_view",
            name: "Role View",
            group: "ROLES",
            description: "Role view"
        },
        {
            key: "role_add",
            name: "Role Add",
            group: "ROLES",
            description: "Roles add"
        },
        {
            key: "role_update",
            name: "Role Update",
            group: "ROLES",
            description: "Role update"
        },
        {
            key: "role_delete",
            name: "Role Delete",
            group: "ROLES",
            description: "Role delete"
        },
        {
            key: "auditlog_view",
            name: "Auditlog View",
            group: "AUDITLOG",
            description: "Auditlog view"
        }

    ]
};