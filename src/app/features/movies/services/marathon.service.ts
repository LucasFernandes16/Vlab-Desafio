import { Injectable } from '@angular/core';

export interface Marathon {
  id: number;
  name: string;
  movies: {
    id: number;    // só IDs, detalhes pegamos da API
    runtime: number; // duração em minutos
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class MarathonService {
  private storageKey = 'myMarathons';
  private marathons: Marathon[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.marathons));
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    this.marathons = data ? JSON.parse(data) : [];
  }

  getMarathons(): Marathon[] {
    return [...this.marathons]; // cópia imutável
  }

  createMarathon(name: string): Marathon {
    const newMarathon: Marathon = {
      id: Date.now(),
      name,
      movies: []
    };
    this.marathons.push(newMarathon);
    this.saveToStorage();
    return newMarathon; // retorna a maratona criada
  }

  addMovieToMarathon(marathonId: number, movieId: number, runtime: number) {
    const marathon = this.marathons.find(m => m.id === marathonId);
    if (marathon && !marathon.movies.some(m => m.id === movieId)) {
      marathon.movies.push({ id: movieId, runtime });
      this.saveToStorage();
    }
  }

  removeMovieFromMarathon(marathonId: number, movieId: number) {
    const marathon = this.marathons.find(m => m.id === marathonId);
    if (marathon) {
      marathon.movies = marathon.movies.filter(m => m.id !== movieId);
      this.saveToStorage();
    }
  }

  deleteMarathon(id: number) {
    this.marathons = this.marathons.filter(m => m.id !== id);
    this.saveToStorage();
  }

  getTotalDuration(marathonId: number): number {
    const marathon = this.marathons.find(m => m.id === marathonId);
    if (!marathon) return 0;
    return marathon.movies.reduce((total, movie) => total + movie.runtime, 0);
  }
}
