import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { InMemoryDataService } from './services/in-memory-data.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { provideHttpClient } from '@angular/common/http';
import { InvoicesService } from './services/invoices.service';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		
		provideRouter(routes),
		provideHttpClient(),
		importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 })),
		InvoicesService,
	]
};
