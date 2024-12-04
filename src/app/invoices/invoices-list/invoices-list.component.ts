import { Component, OnInit } from '@angular/core';
import { Invoice, InvoiceType } from '../../models/invoice.model';
import { NgFor, NgIf } from '@angular/common';
import { InvoicesService } from '../../services/invoices.service';
import { Router } from '@angular/router';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { LocalCurrencyPipe } from '../../pipes/local-currency.pipe';

@Component({
	selector: 'app-invoices-list',
	standalone: true,
	imports: [ LocalCurrencyPipe, NgFor, NgIf],
	templateUrl: './invoices-list.component.html',
	styleUrl: './invoices-list.component.scss',
})
export class InvoicesListComponent implements OnInit {
	invoices: Invoice[] = [];
	isLoading = true;
	invoiceTypes = InvoiceType;

	constructor(
		private invoicesService: InvoicesService,
		private router: Router,
		private pdfGeneratorService: PdfGeneratorService) { }
	
		ngOnInit(): void {
		this.fetchInvoices();
	}

	fetchInvoices(): void {
		this.invoicesService.getInvoices().subscribe({
			next: (data) => {
				this.invoices = data;
				this.isLoading = false;
			},
			error: (err) => console.error('Error fetching invoices', err),
		});
	}

	editInvoice(id: number): void {
		this.router.navigate(['invoices/edit', id]);
	 }
  
	 downloadInvoice(id: number): void {
		this.pdfGeneratorService.generateInvoicePdf(this.invoices[id]);
	 }
}

