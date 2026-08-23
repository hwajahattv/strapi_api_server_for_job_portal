export default (policyContext, config, { strapi }) => {
	const { user } = policyContext.state;

	if (user && user.role && user.role.type === "employee") {
		return true; // allow access
	}

	return false; // deny
};
