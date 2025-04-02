import { Component} from '@angular/core';
import Map from 'ol/Map.js'; 
import View from 'ol/View.js'; 
import TileLayer from 'ol/layer/Tile.js'; 
import { fromLonLat } from 'ol/proj.js'; 
import StadiaMaps from 'ol/source/StadiaMaps.js'; 
import { Vector as VectorLayer } from 'ol/layer.js'; 
import { Point } from 'ol/geom.js'; 
import { Feature } from 'ol';
import { Vector as VectorSource } from 'ol/source.js'; 
import { Style, Fill, Stroke, Circle } from 'ol/style.js'; 

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent {

  ngOnInit(): void {
    this.iniciarMapa();
  }

  iniciarMapa() {
    const coordinates = [
      [-0.4156, 39.3975],
      [-0.4014, 39.5667],
      [-0.4106, 39.3825],
      [-0.4125, 39.3975],
      [-0.4156, 39.3970]
    ];

    const vectorSource = new VectorSource();

    coordinates.forEach(coord => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(coord)), 
      });

      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 15, 
          fill: new Fill({
            color: 'rgba(78, 35, 148, 0.8)', 
          }),
          stroke: new Stroke({
            color: '#DBC9F5', 
            width: 3
          })
        })
      })
    });

    const map = new Map({
      target: 'mapa', 
      layers: [
        new TileLayer({
          source: new StadiaMaps({
            layer: 'alidade_smooth_dark', 
            retina: true,  
          }),
        }),
        vectorLayer 
      ],
      view: new View({
        center: fromLonLat([-0.3763, 39.4699]), 
        zoom: 11,  
      }),
      controls: [] 
    });
  }
}
