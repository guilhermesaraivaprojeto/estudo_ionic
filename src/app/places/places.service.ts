import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-course-8a4b7.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            // tslint:disable-next-line: max-line-length
            places.push(new Place(key, resData[key].title, resData[key].description, resData[key].imageUrl, resData[key].price, new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId));
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlace(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<PlaceData>('https://ionic-angular-course-8a4b7.firebaseio.com/offered-places/' + id + '.json').pipe(map(placeData => {
        return new Place(id, placeData.title, placeData.description, placeData.imageUrl,
          placeData.price, new Date(placeData.availableFrom), new Date(placeData.availableTo), placeData.userId);
      })
    );


    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));


    // return {...this._places.find(p => p.id === id)};
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date ) {
    let generatedId: string;
    // tslint:disable-next-line: max-line-length
    const newPlace = new Place(Math.random().toString(), title, description, 'https://assets.nst.com.my/images/articles/eiffel-tower-3349075_1920_1551624278.jpg', price, dateFrom, dateTo, this.authService.userId);
    // tslint:disable-next-line: max-line-length
    return this.http.post<{name: string}>('https://ionic-angular-course-8a4b7.firebaseio.com/offered-places.json', { ...newPlace, id: null }).pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }), take(1), tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // USANDO O PIPE PARA USAR OS OPERATORS
    // TAKE USADO PARA NAO ASSINAR O OBJETO, PARA APENAS PEGAR O VALOR ATUAL E CANCELE A "ASSINATURA".
    /*this.places.pipe(take(1)).subscribe(places => {
      setTimeout(() => {
        this._places.next(places.concat(newPlace));
      }, 1000);
    });*/

    // TAP EXECUTA A FUNÇAO ASSIM COMO O SUBSCRIBE MAS ELE NAO DA O SUBCRIBE, ASSIM ELE NAO INTEGRROMPE O OBERVER E CONTINUA SENDO UM OBERVER
    /*
    return this.places.pipe(take(1), delay(1000), tap(places => {
      this._places.next(places.concat(newPlace));
    }));*/
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }), switchMap(places => {
      const place_index = places.findIndex(p => p.id === placeId);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[place_index];
      // tslint:disable-next-line: max-line-length
      updatedPlaces[place_index] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId);
      // tslint:disable-next-line: max-line-length
      return this.http.put('https://ionic-angular-course-8a4b7.firebaseio.com/offered-places/' + placeId + '.json', { ...updatedPlaces[place_index], id: null});
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));

    /*
    return this.places.pipe(take(1), tap(places => {
      const place_index = places.findIndex(p => p.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[place_index];
      // tslint:disable-next-line: max-line-length
      updatedPlaces[place_index] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId);
      this._places.next(updatedPlaces);
    }));
    */
  }
}


/*
new Place(
  'p1',
  'Manhattan Mansion',
  'In heart of NY',
  'https://media.nature.com/w800/magazine-assets/d41586-019-00862-y/d41586-019-00862-y_16548374.jpg',
  149.99,
  new Date('2019-01-01'),
  new Date('2019-12-31'),
  'azx'
),
new Place(
  'p2',
  'L\'Amour Toujours',
  'In France',
  'https://assets.nst.com.my/images/articles/eiffel-tower-3349075_1920_1551624278.jpg',
  189.99,
  new Date('2019-01-01'),
  new Date('2019-12-31'),
  'abc'
),
new Place(
  'p3',
  'The Foggy Palace',
  'Not your avarage city trip!',
  'https://live.staticflickr.com/8079/8408026879_4264a66446_b.jpg',
  99.99,
  new Date('2019-01-01'),
  new Date('2019-12-31'),
  'abc'
)*/
