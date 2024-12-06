import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: 'input[type="date"][formControlName], input[type="date"][formControl], input[type="date"][ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateDirective),
      multi: true,
    },
  ],
})
export class CustomDateDirective implements ControlValueAccessor {
  @Input() value: string = '';

  private _onChange: (value: Date | null) => void = () => {};
  private _onTouched: () => void = () => {};

	constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this._onChange(value ? new Date(value) : null);
  }

  @HostListener('blur')
  onBlur(): void {
    this._onTouched();
  }

  writeValue(value: Date | null): void {
    const formattedValue = value ? value.toString().split('T')[0] : '';
    const inputElement = this.el.nativeElement;
    this.renderer.setProperty(inputElement, 'value', formattedValue);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
