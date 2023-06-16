import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { firstValueFrom } from "rxjs";
import { EsriLoaderService } from "../esri-loader.service";
declare type EsriType = typeof import('esri/geometry');
declare type EsriProjectionType = typeof import('esri/geometry/projection');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  esriProjection: EsriProjectionType | undefined;
  esri: EsriType | undefined;

  constructor(
    private http: HttpClient,
    private esriLoaderService: EsriLoaderService,
  ) {}

  async loadWasm() {
    try {
      [this.esri, this.esriProjection] = await this.esriLoaderService.loadModules([
        'esri/geometry',
        'esri/geometry/projection'
      ]);

      await this.esriProjection!.load();

      const point = new this.esri!.Point({
        x: -118,
        y: 34,
        spatialReference: { wkid: 4326 }
      });

      const projectedPoint = this.esriProjection!.project(point, { wkid: 3857 });

      if (projectedPoint) {
        console.log('WASM module loaded successfully.');
        console.log(`Projected Point: ${JSON.stringify(projectedPoint)}`);
      } else {
        console.error('Error loading WASM module.');
      }
    } catch (err) {
        console.error('Error loading WASM module: ', err);
    }
  }

  async loadPdf() {
    this.http.get('https://raw.githubusercontent.com/kyokidG/large-pdf-viewer-poc/58a3df6adc4fe9bd5f02d2f583d6747e187d93ae/public/test2.pdf', {responseType: 'blob'}).subscribe(blob => {
      console.log('Loaded pdf! Blob size: ', blob.size);
    });
  }
}
