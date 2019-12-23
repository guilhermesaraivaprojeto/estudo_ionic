import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;
  isLoading: boolean;

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    // this.offers = this.placesService.places;
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }


  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
    // this.offers = this.placesService.places;
    console.log('ionViewWillEnter');
  }


  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    console.log('Editting item', offerId);
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
