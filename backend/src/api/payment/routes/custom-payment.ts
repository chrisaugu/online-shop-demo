export default {
    routes: [
        {
            method: 'POST',
            path: '/payments/create-intent',
            handler: 'api::payment.payment.createPaymentIntent',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};