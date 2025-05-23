import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appIonInfiniteHorizontal]',
  standalone: true,
})
export class IonInfiniteHorizontalDirective implements AfterViewInit, OnDestroy {
  @Input() threshold: number = 100; // Ngưỡng để kích hoạt sự kiện
  @Input() disabled: boolean = false; // Tắt directive nếu cần
  @Output() ionInfinite = new EventEmitter<IonInfiniteHorizontalDirective>();

  private loading = false;
  private spinnerElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    // Tạo ion-spinner và thêm vào DOM
    this.spinnerElement = this.renderer.createElement('ion-spinner');
    this.renderer.setAttribute(this.spinnerElement, 'name', 'crescent');
    this.renderer.setStyle(this.spinnerElement, 'position', 'absolute');
    this.renderer.setStyle(this.spinnerElement, 'top', '50%');
    this.renderer.setStyle(this.spinnerElement, 'right', '10px');
    this.renderer.setStyle(this.spinnerElement, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.spinnerElement, 'display', 'none'); // Ẩn mặc định
    this.renderer.appendChild(this.el.nativeElement, this.spinnerElement);
  }

  @HostListener('scroll')
  onScroll() {
    if (this.loading || this.disabled) return;

    const element = this.el.nativeElement;
    const scrollLeft = element.scrollLeft;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    if (scrollLeft + this.threshold >= maxScrollLeft) {
      this.loading = true;
      this.showSpinner();
      this.ionInfinite.emit(this);
    }
  }

  complete() {
    this.loading = false;
    this.hideSpinner();
  }

  private showSpinner() {
    if (this.spinnerElement) {
      this.renderer.setStyle(this.spinnerElement, 'display', 'block');
    }
  }

  private hideSpinner() {
    if (this.spinnerElement) {
      this.renderer.setStyle(this.spinnerElement, 'display', 'none');
    }
  }

  ngOnDestroy() {
    // Xóa spinner khỏi DOM khi directive bị hủy
    if (this.spinnerElement) {
      this.renderer.removeChild(this.el.nativeElement, this.spinnerElement);
    }
  }
}
