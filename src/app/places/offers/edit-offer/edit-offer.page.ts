import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  place: Place;
  private placeSub: Subscription;
  isLoading: boolean;
  placeId: string;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private placesService: PlacesService, private navCtrl: NavController, private router: Router,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return ;
      }
      this.isLoading = true;
      this.placeId = paramMap.get('placeId');
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, { updateOn: 'blur', validators: [Validators.required] }),
          // tslint:disable-next-line: max-line-length
          description: new FormControl(this.place.description, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error occurred!', 
          message: 'Place could not be fetched...',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/places/tabs/offers']);
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
      // this.place = this.placesService.getPlace(paramMap.get('placeId'));
      console.log(this.place);
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form);
    this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe();


    this.loadingCtrl.create({
      message: "Updating place..."
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        // this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });



  }

}
