"use strict";

const { createStrapi, compileStrapi } = require("@strapi/strapi");

const seedJobTypes = require("./seed-job-types");
const seedJobStatuses = require("./seed-job-statuses");

async function main() {
    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();

    try {
        app.log.level = "error";

        await seedJobTypes();
        await seedJobStatuses();

        console.log("Master data seeding completed successfully.");
    } catch (error) {
        console.error("Master data seeding failed:", error);
        process.exitCode = 1;
    } finally {
        await app.destroy();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});