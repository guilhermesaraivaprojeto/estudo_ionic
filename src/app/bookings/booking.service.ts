import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root'})
export class Bookingservice {
    private _bookings: Booking[];

    get bookings() {
        return [...this._bookings];
    }
}
