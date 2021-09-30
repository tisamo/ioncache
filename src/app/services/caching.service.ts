import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

// Expire time in seconds
const TTL = 60 * 60;
// Key to identify only cached API data
const CACHE_KEY = '_mycached_';

@Injectable({
  providedIn: 'root'
})
export class CachingService {

  constructor(private storage: Storage) { }

  // Setup Ionic Storage
  async initStorage() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
  }

  // Store request data
  cacheRequest(name, data, url): Promise<any> {
    const validUntil = (new Date().getTime()) + TTL * 1000;
    return this.storage.set(name, {url,validUntil, data, name});
  }

  // Try to load cached data
  async getCachedRequest(name): Promise<any> {
    const currentTime = new Date().getTime();
    name = `${CACHE_KEY}${name}`;

    const storedValue = await this.storage.get(name);

    if (!storedValue) {
      return null;
    } else if (storedValue.validUntil < currentTime) {
      await this.storage.remove(name);
      return null;
    } else {
      return storedValue.data;
    }
  }

  // Remove all cached data & files
  async clearCachedData() {
    this.storage.clear();
  }

  // Example to remove one cached URL
  async invalidateCacheEntry(url) {
    url = `${CACHE_KEY}${url}`;
    await this.storage.remove(url);
  }
}
