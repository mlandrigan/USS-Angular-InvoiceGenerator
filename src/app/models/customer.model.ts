import { Address } from "./address.model";

export interface Customer {
	id: number;
	sellersCustomerId: string;
	customerName: string;
	email: string;
	phone: string;
	billingAddress: Address;
	shippingAddress: Address;
}