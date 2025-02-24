// Desc: Default data for the app
const defaultData = {
    email: "none",

    usage: {
        messaging: {
            limit: 10, // messages/day
            usage: 0,
        },
        files: {
            limit: 20, // in MB
            usage: 0,
        },
        projects: {
            limit: 3, // allowed number of conncurrent data projects
            usage: 0,
        },
    },
    projects: {

    },
    settings: {
        plan: "free",
    },
}

export default defaultData;