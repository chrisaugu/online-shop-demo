export default {
    routes: [
        {
            method: 'POST',
            path: '/webhooks/stripe',
            handler: 'api::webhook.stripe-webhook.handleStripeWebhook',
            config: {
                auth: false,
            },
        },
    ],
};