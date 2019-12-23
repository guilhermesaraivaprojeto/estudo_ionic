import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root'})
export class BookingService {
    /*
    private _bookings: Booking[] = [
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Man',
            guestNumber: 2,
            userId: 'abc'
        }
    ];
    */
    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService, private http: HttpClient) {}

    get bookings() {
        return this._bookings.asObservable();
    }

    fetchBookings() {
      return this.http.get<{ [key: string]: BookingData }>('https://ionic-angular-course-8a4b7.firebaseio.com/offered-bookings.json')
        .pipe( map(resData => {
            const bookings = [];
            for (const key in resData) {
              if (resData.hasOwnProperty(key)) {
                // tslint:disable-next-line: max-line-length
                bookings.push(new Booking(key, resData[key].placeId, resData[key].userId, resData[key].placeTitle,
                  resData[key].placeImage, resData[key].firstName, resData[key].lastName, resData[key].guestNumber,
                  new Date(resData[key].bookedFrom), new Date(resData[key].bookedTo)));
              }
            }
            return bookings;
          }), tap(bookings => {
            this._bookings.next(bookings);
          })
        );
    }

    // tslint:disable-next-line: max-line-length
    addBooking(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
        let bookingId: string;
        // tslint:disable-next-line: max-line-length
        const newBooking = new Booking(Math.random().toString(), placeId, this.authService.userId, placeTitle, placeImage, firstName, lastName, guestNumber, dateFrom, dateTo);
        /*return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
            this._bookings.next(bookings.concat(newBooking));
        }));*/

        // tslint:disable-next-line: max-line-length
        return this.http.post<{name: string}>('https://ionic-angular-course-8a4b7.firebaseio.com/offered-bookings.json', { ...newBooking, id: null })
          .pipe(switchMap(resData => {
              bookingId = resData.name;
              return this.bookings;
            }), take(1), tap(bookings => {
              newBooking.id = bookingId;
              this._bookings.next(bookings.concat(newBooking));
            })
          );

    }

    cancelBooking(bookingId: string) {

      /* OPCAO 1 */
      return this.http.delete('https://ionic-angular-course-8a4b7.firebaseio.com/offered-bookings/' + bookingId + '.json').pipe(tap(() => {
        this.fetchBookings().subscribe();
      }));

      /* OPCAO 2
      return this.http.delete('https://ionic-angular-course-8a4b7.firebaseio.com/offered-bookings/' + bookingId + '.json')
        .pipe(switchMap(() => {
            return this.bookings;
          }), take(1), tap(bookings => {
            this._bookings.next(bookings.filter(b => b.id !== bookingId));
          })
        );*/

      return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
        /*
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
        const loadedBokkings = [...bookings];
        this._bookings.next(loadedBokkings.slice(bookingIndex));
        */

        // USANDO O FILTER
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      }));
    }
}
