import { Component, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { MarathonService, Marathon } from '../../services/marathon.service';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component'
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component'
import { Movie } from '../../types/movie.type';

@Component({
  selector: 'app-theme-generator',
  standalone: true,
  templateUrl: './theme-generator.component.html',
  styleUrls: ['./theme-generator.component.scss'],
  imports: [CommonModule, FormsModule, MovieCardComponent, RouterModule, MovieDetailComponent]
})

export class ThemeGeneratorComponent {
  private movieFacade = inject(MovieFacade);
  private marathonService = inject(MarathonService);

  personName = '';
  role: 'Actor' | 'Director' | 'Writer' = 'Director';
  thematicMovies: any[] = [];

  marathons: Marathon[] = [];
  showMarathonMenu = false;
  newMarathonName = '';


  movie: Movie | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(){
    this.loadMarathons();
  }

  generate() {
    this.loading = true;
    this.error = null;

    if (!this.personName.trim()) {
      this.error = 'Digite um nome';
      this.loading = false;
      return;
    }

    this.movieFacade.searchMoviesByPerson(this.personName, this.role)
      .subscribe({
        next: movies => {
          this.thematicMovies = movies;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao buscar filmes';
          this.loading = false;
        }
      });
  }


  loadMarathons() {
    this.marathons = this.marathonService.getMarathons();
  }
  selectedMarathonId: number | null = null;

  addToMarathon(marathonId: number|null,movie: Movie) {
    if (marathonId) {
      this.marathonService.addMovieToMarathon(marathonId, movie.id, movie.runtime);
      this.loadMarathons();
      this.showMarathonMenu = false;
    }
  }
  
}
