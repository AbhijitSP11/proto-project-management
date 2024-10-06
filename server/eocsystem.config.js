module.exports = {
    apps: [
        {
            name: "proto-project-management", 
            script: "npm", 
            args: "run dev", 
            env: {
                NODE_ENV: "development",
            }
        }
    ]
}