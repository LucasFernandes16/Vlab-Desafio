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
  selectedYear: string = '';
  selectedOrder: string = 'release_date';

  years: number[] = Array.from({ length: 2025 - 1960 + 1 }, (_, i) => 1960 + i); // datas validas em ano Lancamento

  ngOnInit() {
    this.facade.api.getGenres().subscribe((genres: Genre[]) => {
      this.genres = genres;
    });
    this.loadMovieCategories();

    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) {
        this.facade.searchMovies(query);
      } else {
        this.facade.loadPopularMovies();
      }
    });
  }

  private loadMovieCategories() {
    this.facade.loadPopularMovies();

    this.facade.movies$.subscribe(state => {
      this.loading = state.loading;
      this.error = state.error;
      if (state.movies.length > 0) {
        const movies = state.movies.map(movie => ({
          id: movie.id,
          title: movie.title,
          imgSrc: movie.poster_path,
          link: `/movies/${movie.id}`,
          rating: (movie.vote_average / 10) * 100,
          vote: movie.vote_average,
          genre_names: movie.genre_ids.map(id => this.genres.find(g => g.id === id)?.name).filter(Boolean),
          genre_ids: movie.genre_ids, 
          release_date: movie.release_date, 
          popularity: movie.popularity 
        }));

        this.popularMovies = movies;
        this.topRatedMovies = movies.slice(0, 10);
        this.upcomingMovies = movies.slice(10, 20);
        this.nowPlayingMovies = movies.slice(20, 30);
      }
    });
  }

  // Função para filtrar e ordenar
  get filteredAndSortedMovies(): CarouselItem[] {
    let movies = this.popularMovies;

    // Filtro por gênero
    if (typeof this.selectedGenre === 'number') {
      movies = movies.filter(m =>
        m.genre_ids?.includes(this.selectedGenre as number)
      );
    }

    // Filtro por ano
    if (this.selectedYear) {
      movies = movies.filter(m =>
        m.release_date?.startsWith(this.selectedYear)
      );
    }

    // Ordenação
    switch (this.selectedOrder) {
      case 'release_date':
        movies = movies.sort((a, b) => (b.release_date ?? '').localeCompare(a.release_date ?? ''));
        break;
      case 'vote':
        movies = movies.sort((a, b) => (b.vote ?? 0) - (a.vote ?? 0));
        break;
      case 'title':
        movies = movies.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
        break;
      case 'popularity':
        movies = movies.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
    }

    return movies;
  }
}
