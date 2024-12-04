import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [ InvoicesListComponent ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent {
  constructor(private router: Router) {}

  navigateToEdit(type: string, id: number): void {
    this.router.navigate([`/edit/${type}/${id}`]);
  }
}