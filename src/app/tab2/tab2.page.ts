import { Component } from '@angular/core';
import { finalize } from "rxjs/operators";
import { ApiService } from "../services/api.service";
import { CachingService } from "../services/caching.service";
import { LoadingController } from "@ionic/angular";
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  joke = null;
  users = null;

  constructor(private apiService: ApiService, private cachingService: CachingService, private loadingController: LoadingController, private storage: Storage) {
    console.log(this.cachingService.getCachedRequest('https://randomuser.me/api?results=10'));
    console.log(this.storage.get('chuck'));
  }

  async loadChuckJoke(forceRefresh) {
    const loading = await this.loadingController.create({
      message: 'Loading data..'
    });
    await loading.present();

    this.apiService.getChuckJoke(forceRefresh).subscribe(res => {
      this.joke = res;
      loading.dismiss();
    });
  }

  async refreshUsers(event?) {
    const loading = await this.loadingController.create({
      message: 'Loading data..'
    });
    await loading.present();

    const refresh = event ? true : false;

    this.apiService.getUsers(refresh).pipe(
      finalize(() => {
        if (event) {
          event.target.complete();
        }
        loading.dismiss();
      })
    ).subscribe(res => {
      this.users = res;
    });
  }

  async clearCache() {
    this.cachingService.clearCachedData();
  }

}
