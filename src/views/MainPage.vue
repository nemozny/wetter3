<style lang="css" scoped>
@import '../theme/MainPage.css';
</style>

<script lang="ts">
// Imports
import { register } from 'swiper/element/bundle';
import 'swiper/css/zoom';
import {
  IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter, IonSelect, IonList, IonSelectOption, IonGrid, IonRow, IonCol,
  IonFabButton, IonIcon, IonItem, IonButtons, IonImg,
  IonSegment,
  IonSegmentView,
  IonSegmentButton,
  IonSegmentContent,
  IonLabel
} from '@ionic/vue';
import { chevronBack, chevronDown, chevronForward, chevronUp, refreshOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';

// Utility functions
function printDate(date: Date, analyse: boolean): string {
  const temp = new Date(date);
  const pad = (i: number) => (i < 10 ? "0" + i : "" + i);
  const year = analyse ? temp.getFullYear() % 100 : temp.getFullYear()
  return year + pad(1 + temp.getMonth()) + pad(temp.getDate()) + pad(temp.getHours());
}

function get_src(map: string, date: Date): string {
  const base_url = "https://www.wetter3.de/Archiv/GFS/";
  return `${base_url}${printDate(date, false)}_${map}.gif`;
}

register();

export default defineComponent({
  components: {
    IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter, IonSelectOption, IonSelect, IonList,
    IonGrid, IonRow, IonCol, IonFabButton, IonIcon, IonItem, IonButtons, IonImg, IonSegment, IonSegmentView, IonSegmentButton, IonSegmentContent,
    IonLabel
  },
  data: () => ({
    imageSource: get_src("1", new Date(new Date().setHours(Math.floor(new Date().getHours() / 6) * 6))),
    map: "1",
    date: new Date(
      new Date().setHours(Math.floor(new Date().getHours() / 6) * 6, 0, 0, 0)
    ).toISOString(),
    hoursSequence: [0, 6, 12, 18],
    currentHourIndex: -1,
    originalHourIndex: -1,
    selectedSegment: "maps",
    isImageVisible: true,
  }),
  methods: {
    get_analyse_map(map: string, date: Date): string {
      let base_url;
      if (map === "DWD_Analyse") {
        base_url = "https://www.wetter3.de/Archiv/DWD/";
      } else if (map === "UKMet_Analyse") {
        base_url = "https://www.wetter3.de/Archiv/UKMet/";
      } else {
        return "";
      }

      const map_url = `${base_url}${printDate(date, true)}_${map}.gif`;
      // const map_url = `${base_url}${hour < 12 ? "0" + hour : hour}_${map}.gif`;
      console.log(map_url);
      return map_url;
    },
    onSegmentChange(event: CustomEvent) {
      this.selectedSegment = event.detail.value;
      if (this.selectedSegment === "maps") {
        this.resetMap()
      } else if (this.selectedSegment === "analyse") {
        this.resetMap()
      }

      this.currentHourIndex = -1;
      this.onMapChange(this.map);
    },
    updateCurrentHourIndex() {
      const currentHour = Math.floor(new Date(this.date).getHours() / 6) * 6;
      this.currentHourIndex = this.hoursSequence.findIndex((hour) => hour === currentHour);
      this.originalHourIndex = this.currentHourIndex;
    },
    onMapChange(value: string) {
      this.map = value.toString();
      this.updateImageSource();
    },
    onDateChange(value: string) {
      this.date = value;
      this.updateImageSource();
    },
    updateImageSource() {
      if (this.selectedSegment === "maps") {
        const target = get_src(this.map, new Date(this.date));
        this.imageSource = target;
      } else if (this.selectedSegment === "analyse") {
        const target = this.get_analyse_map(this.map, new Date(this.date));
        this.imageSource = target;
      }
    },
    updateDateAndImage(step: number, isDay: boolean = false) {
      this.hideErrorMessage();

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
      document.getElementById("current_date").innerText = new Date(this.date).toLocaleString();
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
    hideErrorMessage() {
      this.isImageVisible = true;
      document.getElementById("missing_data").innerText = "";
    },
    resetMap() {
      const now = new Date();
      now.setHours(Math.floor(now.getHours() / 6) * 6, 0, 0, 0);
      if (this.selectedSegment === "maps") {
        this.map = 1;
        this.date = now.toISOString();
      } else if (this.selectedSegment === "analyse") {
        this.map = "DWD_Analyse";
        this.date = new Date(now - 6 * 60 * 60 * 1000).toISOString();
      }

      this.hideErrorMessage();
      this.currentHourIndex = -1;
      this.updateImageSource();
      document.getElementById("current_date").innerText = new Date(this.date).toLocaleString();
    },
    onImageError() {
      console.error("Image not found");
      this.isImageVisible = false;
      document.getElementById("missing_data").innerText = "No data for this combination of map and date.";
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
    <ion-header>
      <ion-toolbar>
        <ion-row class="ion-align-items-center">
          <ion-col size="1" pull="start">
            <ion-buttons>
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
          </ion-col>
          <ion-col offset="3" size="3">
            <ion-title>Wetter3.de</ion-title>
          </ion-col>
          <ion-col offset="2" size="3">
            <ion-title id="current_date"></ion-title>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="scrollable-content" color="light">
      <!-- <ion-img
        v-if="isImageVisible"
        :src="imageSource"
        alt="Map"
        class="scrollable-img"
        @ionError="onImageError"
        >
      </ion-img> -->

    <div id="missing_data">
    </div>

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
            <img :src="imageSource" alt="Weather map" @error="onImageError" v-if="isImageVisible"/>
          </div>
        </swiper-slide>
      </swiper-container>
    
      </ion-content>
      <ion-footer id="my_footer" class="ion-no-border">

      <ion-grid :fixed="true" class="ion-no-padding">
        <ion-segment @ion-change="onSegmentChange($event)" value="maps">
          <ion-segment-button value="maps" content-id="maps" class="dark">
            <ion-label>Weather maps</ion-label>
          </ion-segment-button>
          <ion-segment-button value="analyse" content-id="analyse" class="dark">
            <ion-label>Weather analysis</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-grid>


        <ion-segment-view>
          <ion-segment-content id="maps">
            <ion-grid :fixed="true" class="ion-no-padding">

              <ion-row class="ion-align-items-center ion-justify-content-center">
                <ion-col size="auto">
                  <ion-fab-button @click="clickLeftDay()" size="small">
                    <ion-icon :icon="chevronBack"></ion-icon>
                    <ion-icon :icon="chevronBack"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="clickLeft()" size="small">
                    <ion-icon :icon="chevronBack"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="resetMap()" size="small">
                    <ion-icon :icon="refreshOutline"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="clickRight()" size="small">
                    <ion-icon :icon="chevronForward"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="clickRightDay()" size="small">
                    <ion-icon :icon="chevronForward"></ion-icon>
                    <ion-icon :icon="chevronForward"></ion-icon>
                  </ion-fab-button>
                </ion-col>

                <ion-col size="auto">
                  <ion-list :inset="true" class="dark">
                    <ion-item class="dark">
                      <ion-select
                        aria-label="Maps"
                        interface="modal"
                        placeholder="Select weather map"
                        @ionChange="onMapChange($event.detail.value)"
                        label-placement="stacked"
                        justify="end"
                        :value="map"
                        class="dark"
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
            </ion-grid>
          </ion-segment-content>

        
          <ion-segment-content id="analyse">
            <ion-grid :fixed="true" class="ion-no-padding">
              <ion-row class="ion-align-items-center ion-justify-content-center">
                <ion-col size="auto">
                  <ion-fab-button @click="clickLeftDay()" size="small">
                    <ion-icon :icon="chevronBack"></ion-icon>
                    <ion-icon :icon="chevronBack"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="clickLeft()" size="small">
                    <ion-icon :icon="chevronBack"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="resetMap()" size="small">
                    <ion-icon :icon="refreshOutline"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="clickRight()" size="small">
                    <ion-icon :icon="chevronForward"></ion-icon>
                  </ion-fab-button>
                </ion-col>
                <ion-col size="auto">
                  <ion-fab-button @click="clickRightDay()" size="small">
                    <ion-icon :icon="chevronForward"></ion-icon>
                    <ion-icon :icon="chevronForward"></ion-icon>
                  </ion-fab-button>
                </ion-col>

                <ion-col size="auto">
                  <ion-list :inset="true" class="dark">
                    <ion-item class="dark">
                      <ion-select
                        aria-label="Analyse"
                        interface="modal"
                        placeholder="Select weather analysis"
                        @ionChange="onMapChange($event.detail.value)"
                        label-placement="stacked"
                        justify="end"
                        :value="map"
                        class="dark"
                      >
                        <ion-select-option value="DWD_Analyse">Deutscher Wetterdienst</ion-select-option>
                        <ion-select-option value="UKMet_Analyse">UK Met</ion-select-option>
                      </ion-select>
                    </ion-item>
                  </ion-list>
                </ion-col>
              </ion-row>
            </ion-grid>

          </ion-segment-content>
        </ion-segment-view>

      </ion-footer>
  </ion-page>
</template>
