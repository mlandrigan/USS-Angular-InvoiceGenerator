import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Invoice, InvoiceType } from '../models/invoice.model';
import { Seller } from '../models/seller.model';

@Injectable({
	providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
	createDb() {
		const sellers: Seller[] = [
			{
				id: 1,
				userEmail: 'retailbiz@gmail.com',
				businessName: 'My Retail Business LLC',
				businessEmail: 'retailbiz@gmail.com',
				businessPhone: '555-555-5555',
				businessAddress: {
					street: '1 Main St',
					city: 'Anytown',
					state: 'MA',
					zip: '01234'
				}
			},
			{
				id: 2,
				userEmail: 'freelancer@gmail.com',
				businessName: 'Freelance Web Dev',
				businessEmail: 'freelancer@gmail.com',
				businessPhone: '555-555-5555',
				businessAddress: {
					street: '1 Main St',
					city: 'Anytown',
					state: 'MA',
					zip: '01234'
				}
			},
			{
				id: 3,
				userEmail: 'serviceco@gmail.com',
				businessName: 'Consulting Services Inc.',
				businessEmail: 'serviceco@gmail.com',
				businessPhone: '555-555-5555',
				businessAddress: {
					street: '1 Main St',
					city: 'Anytown',
					state: 'MA',
					zip: '01234'
				}
			}
		];

		const invoices: Invoice[] = [
			{
				id: 1,
				type: InvoiceType.Retail,
				invoiceNumber: 'INV-0001',
				poNumber: '0200100',
				invoiceDate: new Date('2021-01-01'),
				dueDate: new Date('2021-01-31'),
				sellerInfo: sellers[0],
				customerInfo: {
					id: 1,
					sellersCustomerId: 'DOE,JOHN',
					customerName: 'Doe, John',
					email: 'retailcustomer@gmail.com',
					phone: '555-555-5555',
					billingAddress: {
						street: '23 Elm St',
						city: 'Suburbia',
						state: 'MA',
						zip: '01235'
					},
					shippingAddress: {
						street: '23 Elm St',
						city: 'Suburbia',
						state: 'MA',
						zip: '01235'
					}
				},
				items: [
					{ id: 1, type: 'Retail', description: 'Widget1', quantity: 10, price: 5, lineTotal: 50 },
					{ id: 2, type: 'Retail', description: 'Widget2', quantity: 2, price: 18.99, lineTotal: 37.98 }
				],
				invoiceSubTotal: 87.98,
				discount: 0,
				shippingFee: 0,
				taxRate: 6.25,
				invoiceTaxTotal: 4.4,
				invoiceTotal: 52.5,
				notes: 'Due on receipt.'
			},
			{
				id: 2,
				type: InvoiceType.Freelance,
				invoiceNumber: 'INV-0001',
				poNumber: '',
				invoiceDate: new Date('2024-11-01'),
				dueDate: new Date('2024-11-30'),
				sellerInfo: sellers[1],
				customerInfo: {
					id: 2,
					sellersCustomerId: 'CUST-0001',
					customerName: 'Bob\'s Burgers',
					email: 'bobsburgers@gmail.com',
					phone: '555-555-5555',
					billingAddress: {
						street: '23 Main St',
						city: 'Down Town',
						state: 'MA',
						zip: '01235'
					},
					shippingAddress: {
						street: '23 Main St',
						city: 'Down Town',
						state: 'MA',
						zip: '01235'
					}
				},
				items: [
					{
						id: 3,
						type: 'Freelance',
						description: 'Create website for bobsburgers.com',
						quantity: 7.5,
						price: 45,
						lineTotal: 337.5
					},
					{
						id: 4,
						type: 'Freelance',
						description: 'Integrate online ordering system',
						quantity: 3.25,
						price: 45,
						lineTotal: 146.25
					}
				],
				invoiceSubTotal: 483.75,
				discount: 100,
				shippingFee: 0,
				taxRate: 0,
				invoiceTaxTotal: 0,
				invoiceTotal: 383.75,
				notes: 'Payment due within 30 days.'
			},
			{
				id: 3,
				type: InvoiceType.Services,
				invoiceNumber: 'INV-0001',
				poNumber: '',
				invoiceDate: new Date('2024-11-18'),
				dueDate: new Date('2024-12-18'),
				sellerInfo: sellers[1],
				customerInfo: {
					id: 3,
					sellersCustomerId: 'CUST-0002',
					customerName: `Main St Autos`,
					email: 'mainstautos@gmail.com',
					phone: '555-555-5555',
					billingAddress: {
						street: '25 Main St',
						city: 'Down Town',
						state: 'MA',
						zip: '01235'
					},
					shippingAddress: {
						street: '25 Main St',
						city: 'Down Town',
						state: 'MA',
						zip: '01235'
					},
				},
				items: [
					{
						id: 5,
						type: 'Services',
						description: 'Develop social media marketing plan',
						quantity: 1,
						price: 2500,
						lineTotal: 2500
					},
					{
						id: 6,
						type: 'Services',
						description: 'Perform staffing analysis',
						quantity: 1,
						price: 1500,
						lineTotal: 1500
					}
				],
				invoiceSubTotal: 4000,
				discount: 0,
				shippingFee: 0,
				taxRate: 6.25,
				invoiceTaxTotal: 250,
				invoiceTotal: 4250,
				notes: 'Payment due within 30 days.'
			},
		];
		return { invoices };
	}
}
