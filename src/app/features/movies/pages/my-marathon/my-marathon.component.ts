// src/app/pages/my-marathons/my-marathons.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarathonService, Marathon } from '../../services/marathon.service';
import { MovieFacade } from '../../services/movie.facade';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-my-marathons',
  standalone: true,
  templateUrl: './my-marathon.component.html',
  styleUrls: ['./my-marathon.component.scss'],
  imports: [CommonModule, FormsModule, MovieCardComponent]
})
export class MyMarathonsComponent implements OnInit {
  private marathonService = inject(MarathonService);
  private facade = inject(MovieFacade);

  marathons: Marathon[] = [];
  newMarathonName = '';

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

  getMovieDetails(movieId: number) {
    return this.facade.api.getMovieDetails(movieId);
  }

  getTotalDuration(marathonId: number): number {
    return this.marathonService.getTotalDuration(marathonId);
  }
}
