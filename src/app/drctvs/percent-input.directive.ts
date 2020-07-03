import {OnInit, Directive, ElementRef, HostListener} from '@angular/core';
import {PercentInputPipe} from "../pipes/percent-input.pipe";


@Directive({
  selector: '[percentInput]'
})
export class PercentInputDirective implements OnInit  {

  private element: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private percentInputPipe: PercentInputPipe,
  ) {
    this.element = this.elementRef.nativeElement;
  }
  ngOnInit(){
    this.element.value = this.percentInputPipe.transform(this.element.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value){
    this.element.value = this.percentInputPipe.parse(value);
  }
  @HostListener("blur", ["$event.target.value"])
  onBlur(value){
    this.element.value = this.percentInputPipe.transform(value);
  }
}
