import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::job.job", ({ strapi }) => ({
	async post(ctx) {
		const user = ctx.state.user;

		// --------------------------------------------------
		// 1. Authentication
		// --------------------------------------------------

		if (!user) {
			return ctx.unauthorized("You must be logged in.");
		}

		// --------------------------------------------------
		// 2. Email confirmation
		// --------------------------------------------------

		if (!user.confirmed) {
			return ctx.badRequest("Please confirm your email before posting a job.");
		}

		// --------------------------------------------------
		// 3. Get request body
		// --------------------------------------------------

		const { title, start_date, end_date, budget, work_mode, job_type } =
			ctx.request.body.data || {};

		// --------------------------------------------------
		// 4. Basic validation
		// --------------------------------------------------

		if (!title || !title.trim()) {
			return ctx.badRequest("Job title is required.");
		}

		if (!start_date) {
			return ctx.badRequest("Start date is required.");
		}

		if (!end_date) {
			return ctx.badRequest("End date is required.");
		}

		if (budget === undefined || budget === null || budget === "") {
			return ctx.badRequest("Budget is required.");
		}

		if (!work_mode) {
			return ctx.badRequest("Work mode is required.");
		}

		if (!job_type) {
			return ctx.badRequest("Job type is required.");
		}

		// --------------------------------------------------
		// 5. Validate work mode
		// --------------------------------------------------

		const allowedWorkModes = ["remote", "on-site", "hybrid"];

		if (!allowedWorkModes.includes(work_mode)) {
			return ctx.badRequest("Invalid work mode.");
		}

		// --------------------------------------------------
		// 6. Validate budget
		// --------------------------------------------------

		const numericBudget = Number(budget);

		if (Number.isNaN(numericBudget) || numericBudget < 0) {
			return ctx.badRequest("Budget must be a valid positive number.");
		}

		// --------------------------------------------------
		// 7. Validate dates
		// --------------------------------------------------

		const startDate = new Date(start_date);
		const endDate = new Date(end_date);

		if (Number.isNaN(startDate.getTime())) {
			return ctx.badRequest("Invalid start date.");
		}

		if (Number.isNaN(endDate.getTime())) {
			return ctx.badRequest("Invalid end date.");
		}

		if (endDate < startDate) {
			return ctx.badRequest("End date cannot be earlier than start date.");
		}

		// --------------------------------------------------
		// 8. Find employer belonging to logged-in user
		// --------------------------------------------------

		const employer = await strapi.db.query("api::employer.employer").findOne({
			where: {
				users_permissions_user: user.id,
			},
		});

		if (!employer) {
			return ctx.forbidden(
				"You must be an employer before you can post a job.",
			);
		}

		// --------------------------------------------------
		// 9. Validate Job Type
		// --------------------------------------------------

		const jobTypeId = Number(job_type);

		if (!Number.isInteger(jobTypeId)) {
			return ctx.badRequest("Invalid job type.");
		}

		const selectedJobType = await strapi.db
			.query("api::job-type.job-type")
			.findOne({
				where: {
					id: jobTypeId,
					is_active: true,
				},
			});

		if (!selectedJobType) {
			return ctx.badRequest("The selected job type is invalid or inactive.");
		}

		// --------------------------------------------------
		// 10. Get initial Job Status
		// --------------------------------------------------
		//
		// status_code 1 = initial/open status.
		//
		// Make sure you have a Job Status record with:
		// status_code = 1
		// is_active = true
		//
		// --------------------------------------------------

		const initialJobStatus = await strapi.db
			.query("api::job-status.job-status")
			.findOne({
				where: {
					status_code: 100,
					is_active: true,
				},
			});

		if (!initialJobStatus) {
			return ctx.badRequest("Initial job status is not configured.");
		}

		// --------------------------------------------------
		// 11. Create Job
		// --------------------------------------------------

		const job = await strapi.db.query("api::job.job").create({
			data: {
				title: title.trim(),

				employer: employer.id,

				start_date,

				end_date,

				budget: numericBudget,

				work_mode,

				job_type: selectedJobType.id,

				job_status: initialJobStatus.id,
			},
		});

		// --------------------------------------------------
		// 12. Return response
		// --------------------------------------------------

		return {
			message: "Job posted successfully.",
			data: job,
		};
	},
	async myJobs(ctx) {
		const user = ctx.state.user;

		if (!user) {
			return ctx.unauthorized("You must be logged in.");
		}

		// Find the employer associated with the logged-in user
		const employer = await strapi.db.query("api::employer.employer").findOne({
			where: {
				users_permissions_user: user.id,
			},
		});

		if (!employer) {
			return ctx.forbidden("You do not have an employer profile.");
		}

		// Get jobs belonging to this employer
		const jobs = await strapi.db.query("api::job.job").findMany({
			where: {
				employer: employer.id,
			},

			orderBy: {
				createdAt: "desc",
			},

			populate: {
				job_type: true,
				job_status: true,
				job_requests: true,
			},
		});

		return {
			data: jobs,
		};
	},
}));
