"use strict";

module.exports = {
	routes: [
		{
			method: "GET",
			path: "/job-requests/custom/active",
			handler: "job-request.customActive",
			config: {
				auth: false, // Set to true if you want authentication
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/job-requests/custom/:id",
			handler: "job-request.customFindOne",
			config: {
				auth: false,
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "POST",
			path: "/job-requests/custom/create",
			handler: "job-request.customCreate",
			config: {
				auth: false,
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "PUT",
			path: "/job-requests/custom/update/:id",
			handler: "job-request.customUpdate",
			config: {
				auth: false,
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "DELETE",
			path: "/job-requests/custom/delete/:id",
			handler: "job-request.customDelete",
			config: {
				auth: false,
				policies: [],
				middlewares: [],
			},
		},
	],
};
