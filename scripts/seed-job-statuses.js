"use strict";

const jobStatuses = [
    {
        name: "open",
        display_name: "Open",
        is_active: true,
        status_code: 100,
    },
    {
        name: "in-progress",
        display_name: "In Progress",
        is_active: true,
        status_code: 200,
    },
    {
        name: "completed",
        display_name: "Completed",
        is_active: true,
        status_code: 300,
    },
    {
        name: "cancelled",
        display_name: "Cancelled",
        is_active: true,
        status_code: 400,
    },
    {
        name: "closed",
        display_name: "Closed",
        is_active: true,
        status_code: 500,
    },
];

async function seedJobStatuses() {
    console.log("Seeding job statuses...");

    for (const status of jobStatuses) {
        try {
            const existing = await strapi.db
                .query("api::job-status.job-status")
                .findOne({
                    where: {
                        status_code: status.status_code,
                    },
                });

            if (existing) {
                await strapi.db
                    .query("api::job-status.job-status")
                    .update({
                        where: {
                            id: existing.id,
                        },
                        data: status,
                    });

                console.log(`Updated job status: ${status.display_name}`);
            } else {
                await strapi.db
                    .query("api::job-status.job-status")
                    .create({
                        data: status,
                    });

                console.log(`Created job status: ${status.display_name}`);
            }
        } catch (error) {
            console.error(
                `Failed to seed job status "${status.display_name}":`,
                error.message,
            );
        }
    }

    console.log("Job statuses seeding completed.");
}

module.exports = seedJobStatuses;