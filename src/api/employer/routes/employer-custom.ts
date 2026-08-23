export default {
	routes: [
		{
			method: "POST",
			path: "/employers/become",
			handler: "employer.become",
			config: {
				auth: {},
				policies: [],
				middlewares: [],
			},
		},
	],
};
