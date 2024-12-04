import { Injectable } from '@angular/core';
import { Invoice, InvoiceType } from '../models/invoice.model';
import { jsPDF } from 'jspdf';
import { Address } from '../models/address.model';
import { LocalizationService } from './localization.service';

@Injectable({
	providedIn: 'root'
})
export class PdfGeneratorService {
	pdfDoc: jsPDF = new jsPDF();

	constructor(private locSvc: LocalizationService,) { }

	generateInvoicePdf(invoice: Invoice): void {
		this.pdfDoc = new jsPDF();

		let yPosition = 20
		let lineHeight = 6;
		let leftCol = 20;
		let leftColAlignRight = 100;
		let rightCol = 110;
		let rightColAlignRight = 180;

		// Setup the values that depend on invoice type
		let itemDescriptionLabel = '';
		let itemPriceLabel = '';
		let itemQuantityLabel = '';
		let showItemQuantity = true;

		switch (invoice.type) {
			case InvoiceType.Retail:
				itemDescriptionLabel = 'Product Name';
				itemPriceLabel = 'Price';
				itemQuantityLabel = 'Quantity';
				showItemQuantity = true;
				break;
			case InvoiceType.Services:
				itemDescriptionLabel = 'Service Description';
				itemPriceLabel = 'Amount';
				itemQuantityLabel = '';
				showItemQuantity = false;
				break;
			case InvoiceType.Freelance:
				itemDescriptionLabel = 'Project Description';
				itemPriceLabel = 'Hourly Rate';
				itemQuantityLabel = 'Hours';
				showItemQuantity = true;
				break;
			default:
				itemDescriptionLabel = 'Description';
				itemPriceLabel = 'Price';
				itemQuantityLabel = 'Quantity';
				showItemQuantity = true;
		}

		// Invoice title
		this.pdfDoc.setFontSize(18);
		this.pdfDoc.text('Invoice', 105, yPosition, { align: 'center' });

		// Invoice details
		this.pdfDoc.setFontSize(12);
		yPosition += 2 * lineHeight;
		this.pdfDoc.text(`Invoice Number:`, leftCol, yPosition);
		this.pdfDoc.text(`${invoice.invoiceNumber}`, leftColAlignRight, yPosition, { align: 'right' });

		this.pdfDoc.text(`PO Number:`, rightCol, yPosition);
		this.pdfDoc.text(` ${invoice.poNumber}`, rightColAlignRight, yPosition, { align: 'right' });

		this.pdfDoc.text(`Invoice Date:`, leftCol, yPosition += lineHeight);
		this.pdfDoc.text(` ${this.formatDate(invoice.invoiceDate)}`,
			leftColAlignRight, yPosition, { align: 'right' });

		this.pdfDoc.text(`Due Date:`, rightCol, yPosition);
		this.pdfDoc.text(`${this.formatDate(invoice.dueDate)}`,
			rightColAlignRight, yPosition, { align: 'right' });

		// Seller details
		yPosition += lineHeight * 2;
		this.pdfDoc.text(`From: ${invoice.sellerInfo.businessName}`, leftCol, yPosition);
		this.pdfDoc.text(`Address: \n${this.formatAddress(invoice.sellerInfo.businessAddress)}`, leftCol, yPosition += lineHeight);
		this.pdfDoc.text(`Email: ${invoice.sellerInfo.businessEmail}`, rightCol, yPosition);
		this.pdfDoc.text(`Phone: ${invoice.sellerInfo.businessPhone}`, rightCol, yPosition += lineHeight);

		yPosition += 3 * lineHeight;

		// Customer Information
		this.pdfDoc.text(`Customer Name: ${invoice.customerInfo.customerName}`, leftCol, yPosition);
		this.pdfDoc.text(`Customer ID: ${invoice.customerInfo.sellersCustomerId}`, rightCol, yPosition);
		this.pdfDoc.text(`Customer Email: ${invoice.customerInfo.email}`, leftCol, yPosition += lineHeight);
		this.pdfDoc.text(`Customer Phone: ${invoice.customerInfo.phone}`, rightCol, yPosition);
		yPosition += 2 * lineHeight;
		this.pdfDoc.text(`Billing Address: \n${this.formatAddress(invoice.customerInfo.billingAddress)}`,
			leftCol, yPosition);
		this.pdfDoc.text(`Shipping Address: \n${this.formatAddress(invoice.customerInfo.shippingAddress)}`,
			rightCol, yPosition);

		// Move position down for the items table
		yPosition += 5 * lineHeight;

		let descCol = 20;
		let qtyCol = 100;
		let priceCol = 140;
		let totalCol = 180;

		// Set table headers
		this.pdfDoc.setFontSize(12);
		this.pdfDoc.text(itemDescriptionLabel, descCol, yPosition);
		if (showItemQuantity) {
			this.pdfDoc.text(itemQuantityLabel, qtyCol, yPosition, { align: 'center' });
		}
		this.pdfDoc.text(itemPriceLabel, priceCol, yPosition, { align: 'right' });
		this.pdfDoc.text('Line Total', totalCol, yPosition, { align: 'right' });
		yPosition += lineHeight / 2;
		this.pdfDoc.line(descCol, yPosition, totalCol, yPosition);

		yPosition += lineHeight;

		invoice.items.forEach((item) => {
			this.pdfDoc.text(item.description, descCol, yPosition);
			if (showItemQuantity) {
				this.pdfDoc.text(item.quantity.toString(), qtyCol, yPosition, { align: 'center' });
			}
			this.pdfDoc.text(item.price.toFixed(2), priceCol, yPosition, { align: 'right' });
			this.pdfDoc.text((item.lineTotal).toFixed(2), totalCol, yPosition, { align: 'right' });
			yPosition += lineHeight;
		});

		// Add discount, shipping fee, tax, and total calculations
		this.pdfDoc.text(`Subtotal:`, rightCol, yPosition += (1.25 * lineHeight));
		this.pdfDoc.text(` ${this.locSvc.formatCurrency(invoice.invoiceSubTotal)}`,
			rightColAlignRight, yPosition, { align: 'right' });

		// If discount is 0, don't show it
		if (invoice.discount > 0) {
			this.pdfDoc.text(`Discount:`, rightCol, yPosition += (1.25 * lineHeight));
			this.pdfDoc.text(`${this.locSvc.formatCurrency(invoice.discount)}`,
				rightColAlignRight, yPosition, { align: 'right' });
		}

		this.pdfDoc.text(`Shipping Fee:`, rightCol, yPosition += (1.25 * lineHeight));
		this.pdfDoc.text(`${this.locSvc.formatCurrency(invoice.shippingFee)}`,
			rightColAlignRight, yPosition, { align: 'right' });

		this.pdfDoc.text(`Tax (${invoice.taxRate}%):`, rightCol, yPosition += (1.25 * lineHeight));
		this.pdfDoc.text(`${this.locSvc.formatCurrency(invoice.invoiceTaxTotal)}`,
			rightColAlignRight, yPosition, { align: 'right' });

		this.pdfDoc.text(`Invoice Total:`, rightCol, yPosition += (1.25 * lineHeight))
		this.pdfDoc.text(`${this.locSvc.formatCurrency(invoice.invoiceTotal)}`,
			rightColAlignRight, yPosition, { align: 'right' });

		// Add Notes and Bank Details
		this.pdfDoc.text('Notes / Payment Terms:', leftCol, yPosition += (2 * lineHeight));
		this.pdfDoc.text(invoice.notes, leftCol, yPosition += lineHeight);

		this.pdfDoc.save(`invoice-${invoice.invoiceNumber}.pdf`);
	}

	formatAddress(address: Address): string {
		return `${address.street}\n${address.city}, ${address.state} ${address.zip}`;
	}

	formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString(this.locSvc.userLocale);
	}
}
