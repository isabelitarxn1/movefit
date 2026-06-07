import { Component, OnInit, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ExerciseRepository } from '../../services/exercise.repository';
import { Exercise } from '../../models/exercise.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class CatalogoPage implements OnInit {
  private readonly exerciseRepo = inject(ExerciseRepository);

  /** Ejercicios del catálogo cargados desde la base de datos. */
  readonly exercises = signal<Exercise[]>([]);

  async ngOnInit(): Promise<void> {
    this.exercises.set(await this.exerciseRepo.findAll());
  }
}
