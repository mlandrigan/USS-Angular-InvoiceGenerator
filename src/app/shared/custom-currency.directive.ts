import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LocalizationService } from "../services/localization.service";

@Directive({
  selector: 'input[type="text"].currency[formControlName], input[type="text"].currency[formControl], input[type="text"].currency[ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCurrencyDirective),
      multi: true,
    },
  ],
})
export class CustomCurrencyDirective implements ControlValueAccessor {
  private _onChange: (value: number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(
		private renderer: Renderer2, 
		private el: ElementRef,
		private localizationService: LocalizationService) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    this._onChange(isNaN(numericValue) ? null : numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this._onTouched();
    const inputElement = this.el.nativeElement;
    const numericValue = parseFloat(inputElement.value.replace(/[^0-9.-]/g, ''));
    const includeSymbol = inputElement.classList.contains('show-symbol');
    const formattedValue = this.localizationService.formatCurrency(isNaN(numericValue) ? 0 : numericValue, includeSymbol);
    this.renderer.setProperty(inputElement, 'value', formattedValue);
  }

  writeValue(value: number | null): void {
    const inputElement = this.el.nativeElement;
    const includeSymbol = inputElement.classList.contains('show-symbol');
    const formattedValue = this.localizationService.formatCurrency(value ?? 0, includeSymbol);
    this.renderer.setProperty(inputElement, 'value', formattedValue);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}