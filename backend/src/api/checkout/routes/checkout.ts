export default {
    routes: [
        {
            method: 'POST',
            path: '/checkout/create-session',
            handler: 'api::checkout.checkout.createCheckoutSession',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};