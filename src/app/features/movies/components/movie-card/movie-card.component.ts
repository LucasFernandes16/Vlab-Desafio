import { Component, Input } from '@angular/core';
import { Movie } from '../../types/movie.type';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
  
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  getPosterUrl(posterPath: string): string {
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }
}
