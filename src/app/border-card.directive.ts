import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[menuBorderCard]'
})
export class BorderCardDirective {


  defaultColor: string = "none";

  constructor(private element: ElementRef) { 
    this.setBorderColor(this.defaultColor);
  }

  @HostListener('mouseenter') onMouseEnter(){
    this.setBorderColor('#9C0607');
    this.element.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.removeBorder();
  }


setHeight(height: number){
  this.element.nativeElement.style.height = `${{ height }}px`;
}

setWeight(weight: number){
  this.element.nativeElement.style.weight = `${{ weight }}px`;
}

setBorderColor(color: string){
  this.element.nativeElement.style.border = `solid 4px ${color}`;
}

removeBorder(){
  this.element.nativeElement.style.border = 'none';
}

}
