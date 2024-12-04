import { Routes } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';

export const routes: Routes = [
	{ path: '', component: InvoicesComponent },
	{ path: 'invoices', component: InvoicesComponent },
	{
		path: 'invoices/edit/:id', // Route for editing an invoice or creating a new one
		component: InvoiceEditComponent,
	 },
	 {
		path: 'invoices/new', // Route for creating a new invoice (optional alias for clarity)
		redirectTo: 'invoices/edit/0', // Redirect to the edit page with id=0
	 },
	 {
		path: '**', // Fallback for undefined routes
		redirectTo: '/invoices',
	 },
];
