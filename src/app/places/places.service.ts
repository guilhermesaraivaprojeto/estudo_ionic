import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In heart of NY',
      'https://media.nature.com/w800/magazine-assets/d41586-019-00862-y/d41586-019-00862-y_16548374.jpg',
      149.99
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'In France',
      'https://assets.nst.com.my/images/articles/eiffel-tower-3349075_1920_1551624278.jpg',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your avarage city trip!',
      'https://live.staticflickr.com/8079/8408026879_4264a66446_b.jpg',
      99.99
    )
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
