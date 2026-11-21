import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-11-18.endive',
});

export default factories.createCoreController('api::payment.payment', ({ strapi }) => ({

    async createPaymentIntent(ctx) {
        try {
            const { amount, currency, customerEmail, metadata } = ctx.request.body;

            if (!amount || amount <= 0) {
                return ctx.badRequest('Valid amount is required');
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: currency || 'usd',
                metadata: metadata || {},
                receipt_email: customerEmail,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                },
            });

            await strapi.documents('api::payment.payment').create({
                data: {
                    stripePaymentIntentId: paymentIntent.id,
                    amount: amount,
                    currency: currency || 'usd',
                    status: 'pending',
                    customerEmail: customerEmail,
                    metadata: metadata,
                },
            });

            return ctx.send({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            });

        } catch (error) {
            strapi.log.error('Payment intent creation failed:', error);

            if (error.type === 'StripeCardError') {
                return ctx.badRequest(error.message);
            } else if (error.type === 'StripeInvalidRequestError') {
                return ctx.badRequest('Invalid payment parameters');
            } else if (error.type === 'StripeAPIError') {
                return ctx.internalServerError('Payment service temporarily unavailable');
            }

            return ctx.internalServerError('Payment processing failed');
        }
    },
}));