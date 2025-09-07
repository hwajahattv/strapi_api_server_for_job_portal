"use strict";

module.exports = {
	// Custom route to get active job requests
	async customActive(ctx) {
		try {
			const { query } = ctx;
			const activeJobs = await strapi.entityService.findMany(
				"api::job-request.job-request",
				{
					filters: {
						is_active: true,
						...query.filters,
					},
					populate: "*",
					...query,
				}
			);

			ctx.body = {
				success: true,
				data: activeJobs,
				count: activeJobs.length,
			};
		} catch (error) {
			ctx.throw(500, error);
		}
	},

	// Custom route to find one job request with specific logic
	async customFindOne(ctx) {
		try {
			const { id } = ctx.params;
			const jobRequest = await strapi.entityService.findOne(
				"api::job-request.job-request",
				id,
				{
					populate: "*",
				}
			);

			if (!jobRequest) {
				return ctx.notFound("Job request not found");
			}

			// Add custom logic here
			if (!jobRequest.is_active) {
				return ctx.badRequest("Job request is not active");
			}

			ctx.body = {
				success: true,
				data: jobRequest,
			};
		} catch (error) {
			ctx.throw(500, error);
		}
	},

	// Custom create with additional validation
	async customCreate(ctx) {
		try {
			const { data } = ctx.request.body;

			// Custom validation
			if (!data.title || !data.description) {
				return ctx.badRequest("Title and description are required");
			}

			const newJobRequest = await strapi.entityService.create(
				"api::job-request.job-request",
				{
					data: {
						...data,
						is_active: true, // Set default value
						created_by: ctx.state.user?.id, // If authenticated
					},
					populate: "*",
				}
			);

			ctx.body = {
				success: true,
				data: newJobRequest,
				message: "Job request created successfully",
			};
		} catch (error) {
			ctx.throw(500, error);
		}
	},

	// Custom update with validation
	async customUpdate(ctx) {
		try {
			const { id } = ctx.params;
			const { data } = ctx.request.body;

			// Check if job exists
			const existingJob = await strapi.entityService.findOne(
				"api::job-request.job-request",
				id
			);
			if (!existingJob) {
				return ctx.notFound("Job request not found");
			}

			const updatedJob = await strapi.entityService.update(
				"api::job-request.job-request",
				id,
				{
					data,
					populate: "*",
				}
			);

			ctx.body = {
				success: true,
				data: updatedJob,
				message: "Job request updated successfully",
			};
		} catch (error) {
			ctx.throw(500, error);
		}
	},

	// Soft delete instead of hard delete
	async customDelete(ctx) {
		try {
			const { id } = ctx.params;

			const jobRequest = await strapi.entityService.findOne(
				"api::job-request.job-request",
				id
			);
			if (!jobRequest) {
				return ctx.notFound("Job request not found");
			}

			// Soft delete by setting is_active to false
			await strapi.entityService.update("api::job-request.job-request", id, {
				data: { is_active: false },
			});

			ctx.body = {
				success: true,
				message: "Job request deleted successfully",
			};
		} catch (error) {
			ctx.throw(500, error);
		}
	},
};
