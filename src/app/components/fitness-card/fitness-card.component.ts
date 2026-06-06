import { Component, Input } from '@angular/core';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-fitness-card',
  templateUrl: './fitness-card.component.html',
  styleUrls: ['./fitness-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon
  ]
})
export class FitnessCardComponent {

  @Input() title: string = '';

  @Input() description: string = '';

}
