import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Invoice, InvoiceType } from '../../models/invoice.model';
import { LineItem } from '../../models/line-item.model';
import { InvoicesService } from '../../services/invoices.service';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { LocalizationService } from '../../services/localization.service';
import { PdfGeneratorService } from '../../services/pdf-generator.service';


@Component({
	selector: 'app-invoice-edit',
	standalone: true,
	imports: [ ReactiveFormsModule, NgIf, NgFor, NgForOf ],
	templateUrl: './invoice-edit.component.html',
	styleUrl: './invoice-edit.component.scss'
})
export class InvoiceEditComponent implements OnInit {
	invoiceForm!: FormGroup;
	invoiceId!: number;
	isEditMode = false;
	itemDescriptionLabel = 'Description';
	itemPriceLabel = 'Price';
	itemQuantityLabel = 'Qty';
	showItemQuantity = true;
	localCurrencySymbol = '';

	constructor(
		private invoicesService: InvoicesService,
		private pdfGenerator: PdfGeneratorService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private localizationService: LocalizationService
	) { 
		this.localCurrencySymbol = this.localizationService.currencySymbol;
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.invoiceId = +params['id'];
			this.isEditMode = this.invoiceId !== 0;
			this.initializeForm();
			if (this.isEditMode) {
				this.loadInvoiceData(this.invoiceId);
			}
		});
	}

	private initializeForm(): void {
		this.invoiceForm = this.fb.group({
			id: [0],
			type: [null, Validators.required],
			invoiceNumber: [''],
			poNumber: [''],
			invoiceDate: [null, Validators.required],
			dueDate: [new Date(), Validators.required],
			sellerInfo: this.fb.group({
				id: [null, Validators.required],
				userEmail: ['', [Validators.required, Validators.email]],
				businessName: ['', Validators.required],
				businessEmail: ['', [Validators.required, Validators.email]],
				businessPhone: ['', Validators.required],
				businessAddress: this.fb.group({
					street: ['', Validators.required],
					city: ['', Validators.required],
					state: ['', Validators.required],
					zip: ['', Validators.required],
				}),
			}),
			customerInfo: this.fb.group({
				sellersCustomerId: ['', Validators.required],
				customerName: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
				phone: ['', Validators.required],
				billingAddress: this.fb.group({
					street: ['', Validators.required],
					city: ['', Validators.required],
					state: ['', Validators.required],
					zip: ['', Validators.required],
				}),
				shippingAddress: this.fb.group({
					street: ['', Validators.required],
					city: ['', Validators.required],
					state: ['', Validators.required],
					zip: ['', Validators.required],
				}),
			}),
			items: this.fb.array([]),
			invoiceSubTotal: [{ value: 0, disabled: true }],
			discount: [0],
			taxRate: [0, [Validators.required, Validators.min(0)]],
			invoiceTaxTotal: [{ value: 0, disabled: true }],
			invoiceTotal: [{ value: 0, disabled: true }],
			notes: [''],
		});
	}

	private loadInvoiceData(id: number): void {
		this.invoicesService.getInvoice(id).subscribe((invoice) => {
			this.invoiceForm.patchValue(invoice);
			invoice.items.forEach((item) => this.addItem(item));
			this.calculateTotals();
			this.updateItemLabelsWithInvoiceType();
		});
	}

	onInvoiceTypeChange(): void {
		this.updateItemLabelsWithInvoiceType();
	}

	get items(): FormArray {
		return this.invoiceForm.get('items') as FormArray;
	}

	addItem(item?: LineItem): void {
		const group = this.fb.group({
			id: [item?.id || null],
			type: [item?.type || null, Validators.required],
			description: [item?.description || '', Validators.required],
			quantity: [item?.quantity || 1, [Validators.min(1)]],
			price: [item?.price || 0, [Validators.required, Validators.min(0)]],
			lineTotal: [{ value: item?.lineTotal || 0, disabled: true }],
		});

		this.items.push(group);
		this.calculateTotals();

	}

	removeItem(index: number): void {
		this.items.removeAt(index);
	}

	calculateTotals(): void {
		let items = this.items.value as LineItem[];
		let subTotal:number = 0;

		items.forEach((item) => {
			const lineTotal = item.price * item.quantity;
			subTotal += lineTotal;
			this.items.at(items.indexOf(item)).patchValue({
				price: this.localizationService.formatCurrency(item.price, false),
				lineTotal: this.localizationService.formatCurrency(lineTotal, false), });
		});

		const taxTotal = ((subTotal - this.invoiceForm.value.discount) * this.invoiceForm.value.taxRate) / 100;
		const total = subTotal + taxTotal;

		this.invoiceForm.patchValue({
			invoiceSubTotal: this.localizationService.formatCurrency(subTotal, false),
			discount: this.localizationService.formatCurrency(this.invoiceForm.value.discount, false),
			taxRate: this.localizationService.formatNumber(this.invoiceForm.value.taxRate, 2),
			invoiceTaxTotal: this.localizationService.formatCurrency(taxTotal, false),
			invoiceTotal: this.localizationService.formatCurrency(total, false),
		});
	}

	updateItemLabelsWithInvoiceType(): void {
		
		switch (parseInt(this.invoiceForm.value.type)) {
			case InvoiceType.Retail.valueOf():
				this.itemDescriptionLabel = 'Product Name';
				this.itemPriceLabel = 'Price';
				this.itemQuantityLabel = 'Qty.';
				this.showItemQuantity = true;
				break;
			case InvoiceType.Services:
				this.itemDescriptionLabel = 'Service Description';
				this.itemPriceLabel = 'Amount';
				this.itemQuantityLabel = '';
				this.showItemQuantity = false;
				break;
			case InvoiceType.Freelance:
				this.itemDescriptionLabel = 'Project Description';
				this.itemPriceLabel = 'Hourly Rate';
				this.itemQuantityLabel = 'Hrs.';
				this.showItemQuantity = true;
				break;
			default:
				this.itemDescriptionLabel = 'Description';
				this.itemPriceLabel = 'Price';
				this.itemQuantityLabel = 'Qty.';
				this.showItemQuantity = true;
		}
	}

	saveInvoice(): void {
		if (this.invoiceForm.invalid) {
			this.invoiceForm.markAllAsTouched(); // Trigger validation
			return;
		}

		if (this.invoiceForm.valid) {
			const invoice = this.invoiceForm.getRawValue();
			if(this.isEditMode) {
				this.invoicesService.updateInvoice(invoice);
			} else {
				this.invoicesService.addInvoice(invoice);
			}
			this.router.navigate(['/invoices']);
		} 
	}

	cancel(): void {
		this.router.navigate(['/invoices']);
	}

	createCsv(): void {
		alert('CSV export not implemented yet.');
	}

	createPdf(): void {
		let invoice: Invoice = this.invoiceForm.value;
		this.pdfGenerator.generateInvoicePdf(invoice);
	}
}
