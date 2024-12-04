import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
	private _userLocale: string = 'en-US';
	private _currencyCode: string = 'USD';

  constructor(@Inject(LOCALE_ID) private localeId: string) { 
		this._userLocale = localeId || navigator.language || 'en-US';
		this._currencyCode = this.localeToCurrency[this._userLocale] || 'USD';
	}

	get currencyCode(): string {
		return this._currencyCode;
	}

	get userLocale(): string {
		return this._userLocale;
	}

	get currencySymbol(): string {
    // Use Intl.NumberFormat to format currency
    const formatter = new Intl.NumberFormat(this._userLocale, {
      style: 'currency',
      currency: this._currencyCode,
      minimumFractionDigits: 0, 
    });

    // Extract the currency symbol from the formatted string
    const parts = formatter.formatToParts(1);
    const symbolPart = parts.find(part => part.type === 'currency');
    return symbolPart ? symbolPart.value : '';
  }

	formatCurrency(value: number, includeSymbol: boolean = true): string {
		if(!includeSymbol) {
			return this.formatNumber(value, 2);
		}

		// Use Intl.NumberFormat to format currency
		const formatter = new Intl.NumberFormat(this._userLocale, {
			style: 'currency',
			currency: this._currencyCode,
			minimumFractionDigits: 2, 
		});

		return formatter.format(value);
	}

	formatNumber(value: number, fractionDigits: number = 0): string {
		// Use Intl.NumberFormat to format number
		const formatter = new Intl.NumberFormat(this._userLocale, {
		 minimumFractionDigits:	fractionDigits,
		 maximumFractionDigits: fractionDigits,
		});

		return formatter.format(value);
	}

	private localeToCurrency: { [key: string]: string } = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'ja-JP': 'JPY',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
		'hi-IN': 'INR',
		'en-IN': 'INR',
		'es-ES': 'EUR',
		'zh-CN': 'CNY',
		'ar-SA': 'SAR',
		'pt-BR': 'BRL',
		'ko-KR': 'KRW',
		'it-IT': 'EUR',
		'ru-RU': 'RUB',
		'vi-VN': 'VND',
		'tr-TR': 'TRY',
		'pl-PL': 'PLN',
    // Add more mappings
  };
}
