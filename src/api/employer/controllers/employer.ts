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
		async become(ctx) {
			console.log("========== BECOME CALLED ==========");
			console.log("USER:", ctx.state.user);
			console.log("BODY:", ctx.request.body);
			// 1. Get authenticated user
			const user = ctx.state.user;

			if (!user) {
				return ctx.unauthorized("You must be logged in");
			}

			if (!user.confirmed) {
				return ctx.forbidden(
					"Please confirm your email before becoming an employer",
				);
			}

			// 2. Get request data
			const { data } = ctx.request.body;

			if (!data) {
				return ctx.badRequest("Employer data is required");
			}

			const { name, address, email, contact } = data;

			// 3. Basic validation
			if (!name?.trim()) {
				return ctx.badRequest("Employer name is required");
			}

			if (!email?.trim()) {
				return ctx.badRequest("Employer email is required");
			}

			if (!contact?.trim()) {
				return ctx.badRequest("Contact is required");
			}

			// 4. Check whether user already has an employer
			const existingEmployer = await strapi.db
				.query("api::employer.employer")
				.findOne({
					where: {
						users_permissions_user: user.id,
					},
				});

			if (existingEmployer) {
				return ctx.badRequest("You already have an employer profile");
			}

			// 5. Check whether email is already used
			const existingEmail = await strapi.db
				.query("api::employer.employer")
				.findOne({
					where: {
						email,
					},
				});

			if (existingEmail) {
				return ctx.badRequest("An employer with this email already exists");
			}

			// 6. Find Employer role
			const employerRole = await strapi.db
				.query("plugin::users-permissions.role")
				.findOne({
					where: {
						type: "employer",
					},
				});

			if (!employerRole) {
				return ctx.badRequest("Employer role has not been configured");
			}

			// 7. Create employer
			const employer = await strapi.entityService.create(
				"api::employer.employer",
				{
					data: {
						name,
						address,
						email,
						contact,
						is_active: true,
						parent_id: null,

						users_permissions_user: user.id,
					},
				},
			);

			// 8. Assign Employer role to current user
			await strapi.db.query("plugin::users-permissions.user").update({
				where: {
					id: user.id,
				},
				data: {
					role: employerRole.id,
				},
			});

			// 9. Return response
			return ctx.send({
				message: "You are now an employer",
				employer,
			});
		},
	}),
);
