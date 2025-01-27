import { Stripe } from '../config'

/**
 * create a customer in stripe for the authentified user
 * @param customerToCreate  // stripe customer eg {email,description}
 * @returns Customer object {id,...}
 */

export const createCustomer = async (customerToCreate: Object) => {
    return await Stripe.customers.create(customerToCreate);
}

/**
 * create a paymentMethod in stripe
 * @param paymentCard  // valid credit card  eg {cardNumber,cvv,exp_year,exp_month}
 * @param otherInfo  // containe address or other optional info
 * @returns PaymentMethod object {id,...}
 */

export const createPaymentMethod = async (paymentCard: Object, otherInfo: Object) => {
    return await Stripe.paymentMethods.create({
        type: 'card',
        card: paymentCard,
        ...otherInfo
    });

}
export const attachPaymentMethod = async (customerId: string, paymentId: string) => {
    return await Stripe.paymentMethods.attach(
        paymentId,
        { customer: customerId }
    );

}
export const payUserAmount = async (customerId: string, paymentId: string, amount: number) => {
    return await Stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        customer: customerId,
        payment_method: paymentId,
        confirm: true
    });

}
export const fetchCustomerPaymentMethods = async (customerId: string) => {
    let paymentMethods = await Stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });
    if (Array.isArray(paymentMethods.data)) {
        return paymentMethods.data.map((method: any) => {
            return {
                paymentId: method.id,
                brand: method.card.brand,
                last4: method.card.last4
            }
        })
    }
    return []
}