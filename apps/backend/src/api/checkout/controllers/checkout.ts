import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-11-18.endive',
});

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async createCheckoutSession(ctx) {
        try {
            const { items, customerEmail } = ctx.request.body;

            if (!items || items.length === 0) {
                return ctx.badRequest('Cart items are required');
            }

            const lineItems = await Promise.all(
                items.map(async (item) => {
                    const product = await strapi.documents('api::product.product').findOne({
                        documentId: item.documentId,
                    });

                    if (!product) {
                        throw new Error(`Product ${item.documentId} not found`);
                    }

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: product.title,
                                description: product.description?.substring(0, 500),
                            },
                            unit_amount: Math.round(product.price * 100),
                        },
                        quantity: item.quantity,
                    };
                })
            );

            const total = items.reduce((sum, item, index) => {
                return sum + (lineItems[index].price_data.unit_amount / 100) * item.quantity;
            }, 0);

            const order = await strapi.documents('api::order.order').create({
                data: {
                    customerEmail,
                    items,
                    total,
                    status: 'pending',
                },
            });

            const session = await stripe.checkout.sessions.create({
                // allowed_payment_method_types
                // automatic_payment_methods: {
                //     enabled: true,
                // },
                line_items: lineItems,
                mode: 'payment',
                customer_email: customerEmail,
                success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/cart`,
                metadata: {
                    orderId: order.documentId,
                },
            });

            await strapi.documents('api::order.order').update({
                documentId: order.documentId,
                data: {
                    stripeSessionId: session.id,
                },
            });

            return ctx.send({
                sessionId: session.id,
                url: session.url,
            });

        } catch (error) {
            strapi.log.error('Checkout session creation failed:', error);
            return ctx.internalServerError('Failed to create checkout session');
        }
    },
}));
