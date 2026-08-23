export default {
	routes: [
		{
			method: "POST",
			path: "/employees/become",
			handler: "employee.become",
			config: {
				auth: {},
				policies: [],
				middlewares: [],
			},
		},
	],
};
