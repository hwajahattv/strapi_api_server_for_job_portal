"use strict";

const jobTypes = [
    {
        name: "Full Time",
        slug: "full-time",
        description: "A full-time employment position.",
        is_active: true,
        sort_order: 1,
    },
    {
        name: "Part Time",
        slug: "part-time",
        description: "A part-time employment position.",
        is_active: true,
        sort_order: 2,
    },
    {
        name: "Contract",
        slug: "contract",
        description: "A contract-based employment position.",
        is_active: true,
        sort_order: 3,
    },
    {
        name: "Freelance",
        slug: "freelance",
        description: "A freelance job or assignment.",
        is_active: true,
        sort_order: 4,
    },
    {
        name: "Internship",
        slug: "internship",
        description: "An internship or training position.",
        is_active: true,
        sort_order: 5,
    },
    {
        name: "Project Based",
        slug: "project-based",
        description: "A job associated with a specific project or deliverable.",
        is_active: true,
        sort_order: 6,
    },
];

async function seedJobTypes() {
    console.log("Seeding job types...");

    for (const jobType of jobTypes) {
        try {
            const existing = await strapi.db.query("api::job-type.job-type").findOne({
                where: {
                    slug: jobType.slug,
                },
            });

            if (existing) {
                await strapi.db.query("api::job-type.job-type").update({
                    where: {
                        id: existing.id,
                    },
                    data: jobType,
                });

                console.log(`Updated job type: ${jobType.name}`);
            } else {
                await strapi.db.query("api::job-type.job-type").create({
                    data: jobType,
                });

                console.log(`Created job type: ${jobType.name}`);
            }
        } catch (error) {
            console.error(
                `Failed to seed job type "${jobType.name}":`,
                error.message,
            );
        }
    }

    console.log("Job types seeding completed.");
}

module.exports = seedJobTypes;
