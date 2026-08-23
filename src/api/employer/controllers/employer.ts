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
		async delete(ctx) {
			const { id } = ctx.params;

			console.log("=================================");
			console.log("DELETE EMPLOYER");
			console.log("ID:", id);
			console.log("=================================");

			const employer = await strapi.db.query("api::employer.employer").findOne({
				where: {
					id: Number(id),
				},
			});

			console.log("EMPLOYER BEFORE DELETE:", employer);

			if (!employer) {
				return ctx.notFound("Employer not found");
			}

			const deleted = await strapi.db.query("api::employer.employer").delete({
				where: {
					id: Number(id),
				},
			});

			console.log("DELETED:", deleted);

			return ctx.send(null, 204);
		},
	}),
);
