/**
 * employee controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
	"api::employee.employee",
	({ strapi }) => ({
		async findOne(ctx) {
			const { id } = ctx.params;

			const employee = await strapi.db.query("api::employee.employee").findOne({
				where: {
					id: Number(id),
				},
			});

			return employee || ctx.notFound("Employee not found");
		},
		async delete(ctx) {
			const { id } = ctx.params;

			console.log("=================================");
			console.log("DELETE EMPLOYEE");
			console.log("ID:", id);
			console.log("=================================");

			const employer = await strapi.db.query("api::employee.employee").findOne({
				where: {
					id: Number(id),
				},
			});

			console.log("EMPLOYEE BEFORE DELETE:", employer);

			if (!employer) {
				return ctx.notFound("Employee not found");
			}

			const deleted = await strapi.db.query("api::employee.employee").delete({
				where: {
					id: Number(id),
				},
			});

			console.log("DELETED:", deleted);

			return ctx.send(null, 204);
		},

		async become(ctx) {
			const user = ctx.state.user;

			// 1. Make sure request is authenticated
			if (!user) {
				return ctx.unauthorized("You must be logged in");
			}

			// 2. Get the complete current user
			const currentUser = await strapi.db
				.query("plugin::users-permissions.user")
				.findOne({
					where: {
						id: user.id,
					},
					populate: {
						role: true,
						employer: true,
						employee: true,
					},
				});

			if (!currentUser) {
				return ctx.notFound("User not found");
			}

			// 3. User must not already have a role
			if (currentUser.role && currentUser.role.type !== "authenticated") {
				return ctx.badRequest(
					"You already have a role and cannot become an employee.",
				);
			}

			// 4. Make sure user doesn't already have an employee profile
			if (currentUser.employee) {
				return ctx.badRequest("You are already an employee.");
			}

			// 5. Get Employee role
			const employeeRole = await strapi.db
				.query("plugin::users-permissions.role")
				.findOne({
					where: {
						type: "employee",
					},
				});

			if (!employeeRole) {
				return ctx.badRequest("Employee role is not configured in Strapi.");
			}

			// 6. Validate request body
			const { first_name, last_name, contact } = ctx.request.body?.data || {};

			if (!first_name || !last_name) {
				return ctx.badRequest("First name and last name are required.");
			}

			// 7. Create employee
			const employee = await strapi.db.query("api::employee.employee").create({
				data: {
					first_name,
					last_name,

					// Get these from authenticated user
					username: currentUser.username,
					email: currentUser.email,

					contact: contact || null,
					is_active: true,

					// IMPORTANT:
					// We get the user from ctx.state.user.
					users_permissions_user: currentUser.id,
				},
			});

			// 8. Assign Employee role to current user
			await strapi.db.query("plugin::users-permissions.user").update({
				where: {
					id: currentUser.id,
				},
				data: {
					role: employeeRole.id,
				},
			});

			// 9. Return useful response
			return {
				message: "You are now an employee.",
				employee: {
					id: employee.id,
					documentId: employee.documentId,
					first_name: employee.first_name,
					last_name: employee.last_name,
					username: employee.username,
					email: employee.email,
					contact: employee.contact,
					is_active: employee.is_active,
				},
				role: {
					id: employeeRole.id,
					name: employeeRole.name,
					type: employeeRole.type,
				},
			};
		},
	}),
);
