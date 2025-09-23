import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core'; // esqueci de importar AfterViewInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface CarouselItem {
  id: number;
  title?: string;
  name?: string;
  imgSrc?: string;
  link: string;
  rating?: number;
  vote?: number;
  character?: string;
  genre_ids?: number[];
  release_date?: string;
  popularity?: number;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CarouselComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() items: CarouselItem[] = [];
  @Input() isExplore = false;
  @Input() exploreLink = '';
  @Input() canNavigateLeft = false;
  @Input() canNavigateRight = false;
  @Input() isDefaultCarousel = true;
  @Input() isCastCarousel = false;

  @Output() prevSlideEvent = new EventEmitter<void>();
  @Output() nextSlideEvent = new EventEmitter<void>();

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;

  ngAfterViewInit() {
    this.updateNavigation();
  }

  prevSlide() {
    if (this.canNavigateLeft) {
      this.carouselContainer.nativeElement.scrollLeft -= 300;
      this.updateNavigation();
      this.prevSlideEvent.emit();
    }
  }

  nextSlide() {
    if (this.canNavigateRight) {
      this.carouselContainer.nativeElement.scrollLeft += 300;
      this.updateNavigation();
      this.nextSlideEvent.emit();
    }
  }

  private updateNavigation() {
    const container = this.carouselContainer.nativeElement;
    this.canNavigateLeft = container.scrollLeft > 0;
    this.canNavigateRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
  }

  getPosterUrl(imgSrc: string): string {
    return `https://image.tmdb.org/t/p/w500${imgSrc}`;
  }
}
