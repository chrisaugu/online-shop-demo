import { factories } from '@strapi/strapi';
import Stripe, { Event } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-11-18.endive',
});

export default factories.createCoreController('api::webhook.webhook', ({ strapi }) => ({
    async handleStripeWebhook(ctx) {
        const sig = ctx.request.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event: Event;

        try {
            const rawBody = ctx.request.body[Symbol.for('unparsedBody')];
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err) {
            strapi.log.error(`Webhook signature verification failed: ${err.message}`);
            ctx.status = 400;
            ctx.body = { error: 'Invalid signature' };
            return;
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(event.data.object as any);
                break;

            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(event.data.object as any);
                break;

            case 'checkout.session.completed':
                await this.handleCheckoutComplete(event.data.object as any);
                break;

            default:
                strapi.log.info(`Unhandled event type: ${event.type}`);
        }

        ctx.status = 200;
        ctx.body = { received: true };
    },

    async handleCheckoutComplete(session) {
        const orderId = session.metadata.orderId;

        if (!orderId) {
            strapi.log.warn('Checkout session missing orderId in metadata', {
                sessionId: session.id
            });
            return;
        }

        const orders = await strapi.documents('api::order.order').findMany({
            filters: { documentId: orderId }
        });

        if (orders.length === 0) {
            strapi.log.error(`Order ${orderId} not found`);
            return;
        }

        const carts = await strapi.documents('api::cart.cart').findMany();
        const cart = carts[0];

        const order = orders[0];

        await strapi.documents('api::order.order').update({
            documentId: orderId,
            data: {
                status: 'paid',
                completedAt: new Date()
            },
        });

        // if (order.items)
        // for (const item of order.items) {
        //     const product = await strapi.documents('api::product.product').findOne({
        //         documentId: item.documentId,
        //     });

        //     if (product) {
        //         await strapi.documents('api::product.product').update({
        //             documentId: product.documentId,
        //             data: {
        //                 inventory: Math.max(0, product.inventory - item.quantity),
        //             },
        //         });
        //     }
        // }

        strapi.log.info(`Order ${orderId} marked as paid, inventory updated`);
    },

    async handlePaymentSuccess(paymentIntent) {
        const payments = await strapi.documents('api::payment.payment').findMany({
            filters: { stripePaymentIntentId: paymentIntent.id },
        });

        if (payments.length > 0) {
            await strapi.documents('api::payment.payment').update({
                documentId: payments[0].documentId,
                data: {
                    status: 'succeeded',
                    completedAt: new Date(),
                },
            });
            strapi.log.info(`Payment ${paymentIntent.id} marked as succeeded`);
        }
    },

    async handlePaymentFailure(paymentIntent) {
        const payments = await strapi.documents('api::payment.payment').findMany({
            filters: { stripePaymentIntentId: paymentIntent.id },
        });

        if (payments.length > 0) {
            await strapi.documents('api::payment.payment').update({
                documentId: payments[0].documentId,
                data: {
                    status: 'failed',
                    errorMessage: paymentIntent.last_payment_error?.message,
                },
            });
        }
    },
}));
