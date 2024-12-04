import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Pipe({
  name: 'localCurrency'
})
export class LocalCurrencyPipe implements PipeTransform {

	constructor(private localizationService: LocalizationService) {}

  transform(value: number): unknown {
    return this.localizationService.formatCurrency(value);
  }

}
