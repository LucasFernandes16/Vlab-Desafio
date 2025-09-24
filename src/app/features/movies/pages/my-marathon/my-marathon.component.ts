// src/app/features/movies/pages/my-marathon/my-marathon.component.ts

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Importe o ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarathonService, Marathon } from '../../services/marathon.service';
import { MovieFacade } from '../../services/movie.facade';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { RouterModule } from '@angular/router';
import { Movie } from '../../types/movie.type';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-marathons',
  standalone: true,
  templateUrl: './my-marathon.component.html',
  styleUrls: ['./my-marathon.component.scss'],
  imports: [CommonModule, FormsModule, MovieCardComponent, RouterModule]
})
export class MyMarathonsComponent implements OnInit {
  private marathonService = inject(MarathonService);
  private facade = inject(MovieFacade);
  private cdr = inject(ChangeDetectorRef); // 2. Injete o ChangeDetectorRef

  marathons: Marathon[] = [];
  newMarathonName = '';
  
  selectedMarathonId: number | null = null;
  selectedMarathonMovies: Movie[] = [];
  isLoadingMovies = false;

  ngOnInit() {
    this.loadMarathons();
  }

  loadMarathons() {
    this.marathons = this.marathonService.getMarathons();
  }

  createMarathon() {
    if (this.newMarathonName.trim()) {
      this.marathonService.createMarathon(this.newMarathonName);
      this.newMarathonName = '';
      this.loadMarathons();
    }
  }

  deleteMarathon(id: number) {
    this.marathonService.deleteMarathon(id);
    this.loadMarathons();
  }

  removeMovie(marathonId: number, movieId: number) {
    this.marathonService.removeMovieFromMarathon(marathonId, movieId);{
      this.selectedMarathonMovies = this.selectedMarathonMovies.filter(m => m.id !== movieId);
    };
  }

  toggleMarathonDetails(marathon: Marathon) {
    if (this.selectedMarathonId === marathon.id) {
      this.selectedMarathonId = null;
      this.selectedMarathonMovies = [];
      return;
    }

    this.selectedMarathonId = marathon.id;
    this.isLoadingMovies = true;
    this.selectedMarathonMovies = [];

    if (marathon.movies.length === 0) {
      this.isLoadingMovies = false;
      return;
    }

    const movieObservables = marathon.movies.map(movieRef =>
      this.facade.api.getMovieDetails(movieRef.id)
    );

    forkJoin(movieObservables).subscribe({
      next: (movies) => {
        this.selectedMarathonMovies = movies;
        this.isLoadingMovies = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar os detalhes dos filmes.', err);
        this.isLoadingMovies = false;
      }
    });


  }
}