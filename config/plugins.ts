export default ({ env }) => {
	// Debugging logs (prints in your terminal when Strapi starts)
	console.log("SMTP_HOST:", env("SMTP_HOST"));
	console.log("SMTP_PORT:", env("SMTP_PORT"));
	console.log("SMTP_USER:", env("SMTP_USER"));
	console.log("SMTP_PASS (first 4):", env("SMTP_PASS")?.slice(0, 4));

	return {
		documentation: {
			enabled: true,
			config: {
				info: {
					version: "1.0.0",
					title: "Job Portal API",
					description: "API documentation",
				},
				outputFile: "./openapi.json",
			},
		},
		email: {
			config: {
				provider: "nodemailer",
				providerOptions: {
					host: env("SMTP_HOST", "sandbox.smtp.mailtrap.io"),
					port: env.int("SMTP_PORT", 2525),
					secure: false, // Mailtrap requires false for 2525/587
					auth: {
						user: env("SMTP_USER"),
						pass: env("SMTP_PASS"),
					},
				},
				settings: {
					defaultFrom: "no-reply@yourapp.com",
					defaultReplyTo: "support@yourapp.com",
				},
			},
		},
		"users-permissions": {
			config: {
				jwt: {
					expiresIn: "7d",
				},
				resetPassword: {
					url: "http://localhost:3000/reset-password",
				},
			},
		},
	};
};
