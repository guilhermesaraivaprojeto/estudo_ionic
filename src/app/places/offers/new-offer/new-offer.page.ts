import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      description: new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] }),
      price: new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.min(1)] }),
      dateFrom: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      dateTo: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] })
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    // tslint:disable-next-line: variable-name
    const form_val = this.form.value;
    // tslint:disable-next-line: max-line-length
    console.log(this.placesService.places);
    this.loadingCtrl.create({
      message: "Creating place..."
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.addPlace(form_val.title, form_val.description, +form_val.price, new Date(form_val.dateFrom), new Date(form_val.dateTo)).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });
    console.log(this.form);
    console.log(this.placesService.places);
  }

}
