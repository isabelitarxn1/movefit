import { Component, Input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-fitness-card',
  templateUrl: './fitness-card.component.html',
  styleUrls: ['./fitness-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
  ],
})
export class FitnessCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
