/**
 * employer controller
 */

import { factories } from "@strapi/strapi";
export default factories.createCoreController(
	"api::employer.employer",
	({ strapi }) => ({
		async findOne(ctx) {
			const { id } = ctx.params;
			const employer = await strapi.db.query("api::employer.employer").findOne({
				where: { id: Number(id) },
			});
			return employer || ctx.notFound("Employer not found");
		},
	})
);
