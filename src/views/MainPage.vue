<style lang="css" scoped>
@import '../theme/MainPage.css';
</style>

<script lang="ts">
// Imports
import { register } from 'swiper/element/bundle';
import 'swiper/css/zoom';
import {
  IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter, IonSelect, IonList, IonSelectOption, IonGrid, IonRow, IonCol,
  IonFabButton, IonIcon, IonItem
} from '@ionic/vue';
import { chevronBack, chevronDown, chevronForward, chevronUp, refreshOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';

// Utility functions
function printDate(date: Date): string {
  const temp = new Date(date);
  const pad = (i: number) => (i < 10 ? "0" + i : "" + i);
  return temp.getFullYear() + pad(1 + temp.getMonth()) + pad(temp.getDate()) + pad(temp.getHours());
}

function get_src(map: number, date: Date): string {
  const base_url = "https://www.wetter3.de/Archiv/GFS/";
  return `${base_url}${printDate(date)}_${map}.gif`;
}

register();

export default defineComponent({
  components: {
    IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter, IonSelectOption, IonSelect, IonList,
    IonGrid, IonRow, IonCol, IonFabButton, IonIcon, IonItem
  },
  data: () => ({
    imageSource: get_src(1, new Date(new Date().setHours(Math.floor(new Date().getHours() / 6) * 6))),
    map: 1,
    date: new Date(
      new Date().setHours(Math.floor(new Date().getHours() / 6) * 6, 0, 0, 0)
    ).toISOString(),
    hoursSequence: [0, 6, 12, 18],
    currentHourIndex: -1,
    originalHourIndex: -1,
  }),
  methods: {
    updateCurrentHourIndex() {
      const currentHour = Math.floor(new Date().getHours() / 6) * 6;
      this.currentHourIndex = this.hoursSequence.findIndex((hour) => hour === currentHour);
      this.originalHourIndex = this.currentHourIndex;
    },
    onMapChange(value: number) {
      this.map = value;
      this.updateImageSource();
    },
    onDateChange(value: string) {
      this.date = value;
      this.updateImageSource();
    },
    updateImageSource() {
      const target = get_src(this.map, new Date(this.date));
      this.imageSource = target;
    },
    updateDateAndImage(step: number, isDay: boolean = false) {
      const date = new Date(this.date);
      if (isDay) {
        date.setDate(date.getDate() + step);
        this.date = date.toISOString();
        
      } else{
        if (this.currentHourIndex === -1) {
          this.updateCurrentHourIndex();
        }

        if (this.currentHourIndex === this.hoursSequence.length - 1 && step > 0) {
          this.currentHourIndex = 0;
          date.setDate(date.getDate() + 1);
          date.setHours(this.hoursSequence[this.currentHourIndex]);
          this.date = date.toISOString();

        } else if (this.currentHourIndex === 0 && step < 0) {
          this.currentHourIndex = this.hoursSequence.length - 1;
          date.setDate(date.getDate() - 1);
          date.setHours(this.hoursSequence[this.currentHourIndex]);
          this.date = date.toISOString();
        } else {
          this.currentHourIndex += step;
          date.setHours(this.hoursSequence[this.currentHourIndex]);
          this.date = date.toISOString();
        }
      }

      this.updateImageSource();
      document.getElementById("current_date").innerText = date.toLocaleString();
    },
    clickLeft() {
      this.updateDateAndImage(-1);
    },
    clickRight() {
      this.updateDateAndImage(1);
    },
    clickLeftDay() {
      this.updateDateAndImage(-1, true);
    },
    clickRightDay() {
      this.updateDateAndImage(1, true);
    },
    resetDate() {
      const now = new Date();
      now.setHours(Math.floor(now.getHours() / 6) * 6, 0, 0, 0);
      this.currentHourIndex = this.originalHourIndex;
      this.date = now.toISOString();
      this.updateImageSource();
      document.getElementById("current_date").innerText = now.toLocaleString();
    }
  },
  setup() {
    return { chevronBack, chevronDown, chevronForward, chevronUp, refreshOutline };
  },
});
</script>

<template>
  <ion-menu content-id="main-content">
    <ion-content color="black" class="ion-padding">
      <h3>Wetter3.de</h3>
        <a class="ion-home color-primary item" href='https://www.wetter3.de' target="_blank" rel="noopener noreferrer">
          https://www.wetter3.de
        </a>
      <br />
      <h3>Github</h3>
        <a class="ion-home color-primary item" href='https://github.com/nemozny/wetter3' target="_blank" rel="noopener noreferrer">
          https://github.com/nemozny/wetter3
        </a>
    </ion-content>
  </ion-menu>

  <ion-page id="main-content">
    <ion-header class="header-overlay">
      <ion-toolbar>
        <ion-buttons>
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-row>
          <ion-col>
            <ion-title>Wetter3.de</ion-title>
            <ion-title id="current_date"></ion-title>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" color="light">
      <swiper-container
        :slides-per-view="1"
        :scrollbar="true"
        :navigation="true"
        :centered-slides="true"
        :zoom="true"
        :grab-cursor="true"
        :keyboard="true"
      >
        <swiper-slide>
          <div class="swiper-zoom-container">
            <img :src="imageSource" alt="No data" style="width: 100%; height: 100%;" />
          </div>
        </swiper-slide>
      </swiper-container>

      <ion-footer id="my_footer">
        <ion-grid id="foot_menu">

          <ion-row>
            <ion-col>
              <ion-list>
                <ion-item>
                  <ion-select
                    aria-label="Maps"
                    interface="popover"
                    placeholder="Select weather map"
                    @ionChange="onMapChange($event.detail.value)"
                    label-placement="stacked"
                    justify="space-between"
                    :value="map"
                  >
                    <ion-select-option value="1">500hPa geopot.,MSL pres., ReTop</ion-select-option>
                    <ion-select-option value="2">700hPa relative humidity</ion-select-option>
                    <ion-select-option value="3">850hPa geopot & temperature</ion-select-option>
                    <ion-select-option value="4">precipitation 3/6/12h-ly</ion-select-option>
                    <ion-select-option value="5">850 hPa pseudopot. temperature</ion-select-option>
                    <ion-select-option value="6">500 hPa vertical velocity</ion-select-option>
                    <ion-select-option value="7">500 hPa vorticity advection</ion-select-option>
                    <ion-select-option value="8">300 hPa vorticity advection</ion-select-option>
                    <ion-select-option value="9">advection of ReTop 500/1000</ion-select-option>
                    <ion-select-option value="10">850 hPa temperature advection</ion-select-option>
                    <ion-select-option value="11">850 hPa FQn, frontal zones</ion-select-option>
                    <ion-select-option value="12">500 hPa FQ, geopotential</ion-select-option>
                    <ion-select-option value="13">frontal zones, vertical vel., P</ion-select-option>
                    <ion-select-option value="14">low level cloud cover</ion-select-option>
                    <ion-select-option value="15">mid level clouds cover</ion-select-option>
                    <ion-select-option value="16">high level clouds cover</ion-select-option>
                    <ion-select-option value="17">2 m temperature</ion-select-option>
                    <ion-select-option value="18">2 m dew point temp.</ion-select-option>
                    <ion-select-option value="19">min/max temperatures</ion-select-option>
                    <ion-select-option value="20">SYNOP symbols CE</ion-select-option>
                    <ion-select-option value="21">10 m wind CE</ion-select-option>
                    <ion-select-option value="22">10 m wind</ion-select-option>
                    <ion-select-option value="23">KO Index, vertikal vel.</ion-select-option>
                    <ion-select-option value="24">Soaring Index, deep conv. clouds</ion-select-option>
                    <ion-select-option value="25">850hPa geopotential,temperature</ion-select-option>
                    <ion-select-option value="26">700hPa Geopotential,temperature</ion-select-option>
                    <ion-select-option value="27">500hPa geopotential,temperature</ion-select-option>
                    <ion-select-option value="28">300hPa geopotential,temperature</ion-select-option>
                    <ion-select-option value="29">200hPa geopotential,temperature</ion-select-option>
                    <ion-select-option value="30">precipitation: phase/intens.</ion-select-option>
                    <ion-select-option value="31">2 m temperature CE</ion-select-option>
                    <ion-select-option value="32">2 m dew point T. CE</ion-select-option>
                    <ion-select-option value="33">2 m min/max temp. CE</ion-select-option>
                    <ion-select-option value="34">precipitation CE 3/6/12h-ly</ion-select-option>
                    <ion-select-option value="35">snow line, snow depth</ion-select-option>
                    <ion-select-option value="36">total clouds cover</ion-select-option>
                    <ion-select-option value="37">boundary layer clouds</ion-select-option>
                    <ion-select-option value="38">300 hPa Wind, divergence</ion-select-option>
                    <ion-select-option value="39">Theta=320 K IPV</ion-select-option>
                    <ion-select-option value="40">trajectories (HB, P, KA, M)</ion-select-option>
                    <ion-select-option value="41">850 hPa Wind, rel. vorticity</ion-select-option>
                    <ion-select-option value="42">500 hPa wind, rel. vorticity</ion-select-option>
                    <ion-select-option value="43">300 hPa Wind, rel. vorticity</ion-select-option>
                    <ion-select-option value="44">accum. precipitation</ion-select-option>
                    <ion-select-option value="45">10 m wind gusts (by model)</ion-select-option>
                    <ion-select-option value="46">850 hPa frontogenesis</ion-select-option>
                    <ion-select-option value="47">500 hPa (|Vmod|-|Vgeo|)/|Vgeo|</ion-select-option>
                    <ion-select-option value="48">Lifted Index, CAPE</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-list>
            </ion-col>
          </ion-row>
          
          <ion-row>
            <ion-col>
              <ion-fab-button @click="clickLeftDay()">
                <ion-icon :icon="chevronBack"></ion-icon>
                <ion-icon :icon="chevronBack"></ion-icon>
              </ion-fab-button>
            </ion-col>
            <ion-col>
              <ion-fab-button @click="clickLeft()">
                <ion-icon :icon="chevronBack"></ion-icon>
              </ion-fab-button>
            </ion-col>
            <ion-col>
              <ion-fab-button @click="resetDate()">
                <ion-icon :icon="refreshOutline"></ion-icon>
              </ion-fab-button>
            </ion-col>
            <ion-col>
              <ion-fab-button @click="clickRight()">
                <ion-icon :icon="chevronForward"></ion-icon>
              </ion-fab-button>
            </ion-col>
            <ion-col>
              <ion-fab-button @click="clickRightDay()">
                <ion-icon :icon="chevronForward"></ion-icon>
                <ion-icon :icon="chevronForward"></ion-icon>
              </ion-fab-button>
            </ion-col>
          </ion-row>

        </ion-grid>
      </ion-footer>
    </ion-content>
  </ion-page>
</template>

<!-- <style scoped>
.header-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8); /* Optional: Add transparency */
  }
  
  body {
    background-color: white;
  }
  
  #container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  #container strong {
    font-size: 20px;
    line-height: 26px;
  }
  
  #container p {
    font-size: 16px;
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
  }
  
  #container a {
    text-decoration: none;
  }
  
  #my_footer {
    min-height: fit-content;
    max-height: fit-content;
    text-align: center;
    align-self: right;
    position: fixed;
    bottom: 0;
  }
  
  ion-list {
    max-width: 300px; 
    min-width: 300px;
    max-height: 56px;
    padding: 0;
    background-color: rgba(0,0,0,0.6);
    box-shadow: 0px 1px 2px 0px rgba(255 255, 255, 1), 0px 1px 3px 1px rgba(255, 255, 255, 1);
    color: white;
    align-self: stretch;
    text-align: center;
  }
  
  ion-item {
    background-color: rgba(0,0,0,0.4);
    border-style: solid;
    border-width: thin;
    border-color: white;
  }
  
  ion-select {
    background: transparent;
    opacity: 80%;
    text-align: center;
  }
  
  ion-select-option {
    background-color: transparent;
    opacity: 50%;
    text-align: center;
  }
  
  ion-row {
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
  }
  
  ion-col {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: space-around;
  }
  
  ion-datetime {
    --background: rgba(255,255,255,0.3);
    background: transparent;
    --background-color: rgba(0,0,0,0);
    align-items: start;
  }
  
  ion-fab-button::part(native) {
    background-color: rgba(0,0,0,0.6);
    border-radius: 4px;
    box-shadow: 0px 1px 2px 0px rgba(255 255, 255, 1), 0px 1px 3px 1px rgba(255, 255, 255, 1);
    color: white;
  }
  
  ion-grid {
    background-color: rgba(0, 0, 0, 0);
  }
  
  ion-header {
    opacity: 60%;
  }
  
  #transparent {
    color: white;
    background-color: transparent;
  }
  
  ion-menu {
    --background: rgba(0, 0, 0, 0.8);
    --ion-background-color: transparent;
    --ion-color-base: transparent !important;
    left: 0px;
  }
  
  h3 {
    left: 20px;
    position: relative;
  }
  
  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid white;
    margin: 1em 0;
    padding: 0;
  }
  
  /* Right */
  #foot_menu {
    min-width: 400px;
    width: fit-content;
    position: fixed;
    right: 0;
    /* transform: translate(-50%); */
    bottom: 0;
    background-color: rgba(114, 106, 106, 0.6);
    padding: 1em;
    /* height: 88px; */
    height: fit-content;
    border-radius: 12px;
    border-color: white;
    border-style: solid;
    border-width: thin;
  }
  
  .item.item-trns {
    border-color: rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
    color: white; 
  }
  </style> -->