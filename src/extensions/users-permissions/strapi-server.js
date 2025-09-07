export default (plugin) => {
    /**
     * Override Register
     */
    const originalRegister = plugin.controllers.auth.register;

    plugin.controllers.auth.register = async (ctx) => {
        try {
            await originalRegister(ctx);

            if (ctx.response?.body) {
                ctx.response.body = {
                    ...ctx.response.body,
                    message: "User registered successfully!",
                    status: "success",
                };
            }
        } catch (err) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: err?.message || "Registration failed",
                status: "error",
            };
        }
    };

    /**
     * Override Login (callback)
     */
    const originalCallback = plugin.controllers.auth.callback;

    plugin.controllers.auth.callback = async (ctx) => {
        try {
            await originalCallback(ctx);

            if (ctx.response?.body) {
                ctx.response.body = {
                    ...ctx.response.body,
                    message: "Login successful!",
                    status: "success",
                };
            }
        } catch (err) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: err?.message || "Login failed",
                status: "error",
            };
        }
    };

    return plugin;
};
