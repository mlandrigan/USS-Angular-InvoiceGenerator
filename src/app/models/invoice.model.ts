import { LineItem } from './line-item.model';
import { Seller } from './seller.model';
import { Customer } from './customer.model';

export enum InvoiceType {
	'Retail' = 1,
	'Freelance' = 2,
	'Services' = 3
}

export interface Invoice {
	id: number;
	type: InvoiceType;
	invoiceNumber: string;
	poNumber: string;
	invoiceDate: Date;
	dueDate: Date;
	sellerInfo: Seller;
	customerInfo: Customer;
	items: LineItem[];
	invoiceSubTotal: number;
	discount: number;
	shippingFee: number;
	taxRate: number;
	invoiceTaxTotal: number;
	invoiceTotal: number;
	notes: string;
}

