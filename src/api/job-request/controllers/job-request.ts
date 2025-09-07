/**
 * job-request controller
 */

("use strict");
import { factories } from "@strapi/strapi";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
	"api::job-request.job-request",
	({ strapi }) => ({
		async customActive(ctx) {
			try {
				const activeJobs = await strapi.db
					.query("api::job-request.job-request")
					.findMany({
						where: { job_status: "active" },
					});
				return activeJobs;
			} catch (err) {
				ctx.throw(500, err);
			}
		},

		async customFindOne(ctx) {
			const { id } = ctx.params;
			const job = await strapi.db
				.query("api::job-request.job-request")
				.findOne({
					where: { id },
				});
			return job;
		},

		async customCreate(ctx) {
			const data = ctx.request.body;
			const job = await strapi.db.query("api::job-request.job-request").create({
				data,
			});
			return job;
		},

		async customUpdate(ctx) {
			const { id } = ctx.params;
			const data = ctx.request.body;
			const job = await strapi.db.query("api::job-request.job-request").update({
				where: { id },
				data,
			});
			return job;
		},

		async customDelete(ctx) {
			const { id } = ctx.params;
			const job = await strapi.db.query("api::job-request.job-request").delete({
				where: { id },
			});
			return job;
		},
	})
);

export default factories.createCoreController("api::job-request.job-request");
