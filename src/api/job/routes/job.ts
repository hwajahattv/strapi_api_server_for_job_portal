export default {
	routes: [
		{
			method: "GET",
			path: "/jobs",
			handler: "job.find",
			config: {
				policies: ["global::is-employee"],
			},
		},
		{
			method: "GET",
			path: "/jobs/:id",
			handler: "job.findOne",
			config: {
				policies: ["global::is-employee"],
			},
		},
		// you can add POST/PUT/DELETE with same policy if needed
	],
};
