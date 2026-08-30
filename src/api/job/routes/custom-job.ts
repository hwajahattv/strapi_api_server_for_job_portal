export default {
	routes: [
		{
			method: "POST",
			path: "/jobs/post",
			handler: "job.post",
			config: {
				auth: {},
			},
		},
		{
			method: "GET",
			path: "/jobs/my-jobs",
			handler: "job.myJobs",
			config: {
				auth: {},
				policies: [],
			},
		},
	],
};
