import { Component, OnInit, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { CarouselComponent, CarouselItem } from '@shared/components/carousel/carousel.component';
import { Genre } from '../../types/movie.type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MovieCardComponent,
    ReactiveFormsModule,
    CarouselComponent, // faltava importar aqui
    FormsModule // para usar o forms
  ]
})
export class MovieListComponent implements OnInit {
  facade = inject(MovieFacade);
  searchControl = new FormControl('');

  popularMovies: CarouselItem[] = [];
  topRatedMovies: CarouselItem[] = [];
  upcomingMovies: CarouselItem[] = [];
  nowPlayingMovies: CarouselItem[] = [];

  loading = false;
  error: string | null = null;

  genres: Genre[] = [];
  selectedGenre: number | null = null;
  selectedYear = '';
  selectedOrder: 'release_date' | 'vote' | 'title' | 'popularity' = 'release_date';

  years = Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 1960 + i);

  ngOnInit() {
    this.facade.api.getGenres().subscribe(genres => (this.genres = genres));
    this.loadMovieCategories();
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.facade.searchMovies(query || ''));
  }

  private mapMovies(raw: any[]): CarouselItem[] {
    return raw.map(m => ({
      id: m.id,
      title: m.title,
      imgSrc: m.poster_path,
      link: `/movies/${m.id}`,
      rating: (m.vote_average / 10) * 100,
      vote: m.vote_average,
      genre_ids: m.genre_ids,
      release_date: m.release_date,
      popularity: m.popularity
    }));
  }

  private loadMovieCategories() {
    this.facade.loadPopularMovies();
    this.facade.movies$.subscribe(state => {
      this.loading = state.loading;
      this.error = state.error;
      if (!state.movies.length) return;
      const movies = this.mapMovies(state.movies);
      this.popularMovies = movies;
      this.topRatedMovies = [...movies].sort((a, b) => (b.vote ?? 0) - (a.vote ?? 0)).slice(0, 15);
      this.upcomingMovies = movies.slice(10, 30);
      this.nowPlayingMovies = movies.slice(30, 50);
    });
  }

  get filteredAndSortedMovies(): CarouselItem[] {
    let list = [...this.popularMovies];
    if (typeof this.selectedGenre === 'number') {
      list = list.filter(m => m.genre_ids?.includes(this.selectedGenre as number));
    }
    if (this.selectedYear) {
      list = list.filter(m => (m.release_date ?? '').startsWith(this.selectedYear));
    }
    const sorters: Record<string, (a: CarouselItem, b: CarouselItem) => number> = {
      release_date: (a, b) => (b.release_date ?? '').localeCompare(a.release_date ?? ''),
      vote: (a, b) => (b.vote ?? 0) - (a.vote ?? 0),
      title: (a, b) => (a.title ?? '').localeCompare(b.title ?? ''),
      popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
    };
    return list.sort(sorters[this.selectedOrder]);
  }
}
