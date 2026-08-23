export default {
	async getMe(ctx) {
		const user = ctx.state.user;

		if (!user) {
			return ctx.unauthorized("You must be logged in");
		}

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

		return {
			id: currentUser.id,
			documentId: currentUser.documentId,
			username: currentUser.username,
			email: currentUser.email,
			confirmed: currentUser.confirmed,
			blocked: currentUser.blocked,

			role: currentUser.role
				? {
						id: currentUser.role.id,
						name: currentUser.role.name,
						type: currentUser.role.type,
					}
				: null,

			employer: currentUser.employer
				? {
						id: currentUser.employer.id,
						documentId: currentUser.employer.documentId,
						name: currentUser.employer.name,
						address: currentUser.employer.address,
						email: currentUser.employer.email,
						contact: currentUser.employer.contact,
						is_active: currentUser.employer.is_active,
					}
				: null,
			employee: currentUser.employee
				? {
						id: currentUser.employee.id,
						documentId: currentUser.employee.documentId,
						name: currentUser.employee.name,
						address: currentUser.employee.address,
						email: currentUser.employee.email,
						contact: currentUser.employee.contact,
					}
				: null,
		};
	},
};
