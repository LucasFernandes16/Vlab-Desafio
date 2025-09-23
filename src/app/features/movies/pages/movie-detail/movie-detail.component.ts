import { Component, OnInit, inject} from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { CommonModule, AsyncPipe } from '@angular/common';
import { CarouselComponent } from '@shared/components/carousel/carousel.component';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../types/movie.type';
import { Genre } from '../../types/movie.type';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CarouselComponent
  ]

})

export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  facade = inject(MovieFacade);

  movie: Movie | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.getMovieDetails(+id).subscribe({
        next: (data) => {
          this.movie = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar detalhes do filme';
          this.loading = false;
        }
      });
    } else {
      this.error = 'ID do filme não encontrado';
      this.loading = false;
    }
  }

  getGenreName(genreId: number): string {
    const genres: Genre[] = [
      { id: 28, name: 'Ação' },
      { id: 12, name: 'Aventura' },
      { id: 16, name: 'Animação' },
      { id: 35, name: 'Comédia' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentário' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Família' },
      { id: 14, name: 'Fantasia' },
      { id: 36, name: 'História' },
      { id: 27, name: 'Terror' },
      { id: 10402, name: 'Música' },
      { id: 9648, name: 'Mistério' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Ficção Científica' },
      { id: 10770, name: 'Cinema TV' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'Guerra' },
      { id: 37, name: 'Faroeste' }
    ];

    const genre = genres.find(g => g.id === genreId);
    return genre ? genre.name : 'Desconhecido';
  }

  getPosterUrl(path: string): string {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : 'assets/no-poster.png'; // 👈 fallback se não tiver imagem
}
}