<template>
  <ion-menu content-id="main-content">
    <ion-header>
    </ion-header>
    <ion-content color="black" class="ion-padding">
      <h3>Select date</h3>
    </ion-content>
  </ion-menu>

  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" color="light">
      <!-- <ion-img :src="imageSource" alt="No data"></ion-img> -->

      <div
        class="zoom-container"
        @mousedown="startPan"
        @mousemove="panImage"
        @mouseup="endPan"
        @mouseleave="endPan"
        @wheel="zoomImage"
        :style="{
          transform: 'scale(' + zoomLevel + ') translate(' + panX + 'px, ' + panY + 'px)',
        }"
      >
        <img :src="imageSource" alt="Zoomable and Pannable Image" />
      </div>

      <!-- <ion-img 
        :src="imageSource" 
        alt="No data" 
        @wheel="zoomImage" 
        :style="{ transform: 'scale(' + zoomLevel + ')' }">
      </ion-img> -->


      <!-- <Swiper
        :zoom="true"
        :slides-per-view="1"
        :space-between="0"
        class="mySwiper"
      >
        <SwiperSlide>
          <div class="swiper-zoom-container">
            <img :src="imageSource" alt="Zoomable Image" />
          </div>
        </SwiperSlide>
      </Swiper> -->

      <ion-footer id="my_footer">
        <ion-grid>
          <ion-row id="foot_menu">
            <ion-col></ion-col>
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
              <ion-list>
                <ion-select aria-label="Maps" interface="popover" placeholder="Select map" @ionChange="onMapChange($event.detail.value)" label-placement="stacked" justify="space-between">
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
              </ion-list>
            </ion-col>
            <ion-col>
              <ion-fab-button @click="get_back()">
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

<script lang="ts">
function printDate(date) {
  const temp = new Date(date);
  const pad = (i) => (i < 10) ? "0" + i : "" + i;

  return temp.getFullYear() +
    pad(1 + temp.getMonth()) +
    pad(temp.getDate()) +
    pad(temp.getHours());
}

function get_src(map, date) {
  var base_url = "https://www.wetter3.de/Archiv/GFS/";
  var url = base_url + printDate(date) + "_" + map + ".gif";
  console.log(url);
  return url;
}

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/autoplay';

import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonPicker, IonFooter, IonImg, IonSelect, IonList, IonSelectOption, IonItem, IonDatetime, IonGrid, IonRow, IonCol } from '@ionic/vue';

import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/vue';
import { add, chevronBack, chevronDown, chevronForward, chevronUp, refreshOutline } from 'ionicons/icons';

import { defineComponent } from 'vue';

export default defineComponent({
    components: { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonPicker, IonFooter, IonImg, IonSelectOption, IonSelect, IonList, IonItem, IonDatetime, 
      IonGrid, IonRow, IonCol,
      Swiper, SwiperSlide,
      IonFab, IonFabButton, IonFabList, IonIcon
    },
    data: () => ({
        imageSource: "https://www.wetter3.de/Archiv/GFS/" + printDate(new Date().setHours(Math.floor(new Date().getHours()/6)*6)) + "_1.gif",
        map : 1,
        date: new Date(
          new Date().setHours(
              Math.floor(new Date().getHours() / 6) * 6,
              0,
              0,
              0
          )
        ).toISOString(),
        zoomLevel: 1,
        panX: 0, // Horizontal pan offset
        panY: 0, // Vertical pan offset
        isPanning: false, // Whether the user is currently panning
        startX: 0, // Starting X position of the mouse
        startY: 0, // Starting Y position of the mouse
    }),
    methods: {
      zoomImage(event) {
        const zoomStep = 0.1; // Adjust zoom step as needed
        if (event.deltaY < 0) {
          // Zoom in
          this.zoomLevel = Math.min(this.zoomLevel + zoomStep, 3); // Max zoom level
        } else {
          // Zoom out
          this.zoomLevel = Math.max(this.zoomLevel - zoomStep, 1); // Min zoom level
        }

        // Adjust pan values to ensure the image stays within bounds after zooming
        this.adjustPanBounds();
      },
      resetPan() {
        this.panX = 0;
        this.panY = 0;
      },
      startPan(event) {
        this.isPanning = true;
        this.startX = event.clientX - this.panX;
        this.startY = event.clientY - this.panY;
      },
      panImage(event) {
        if (!this.isPanning) return;

        // Calculate new pan values
        const newPanX = event.clientX - this.startX;
        const newPanY = event.clientY - this.startY;

        // Apply bounds to prevent panning outside the image
        this.panX = this.clampPan(newPanX, 'x');
        this.panY = this.clampPan(newPanY, 'y');
      },
      endPan() {
        this.isPanning = false;
      },
      clampPan(value, axis) {
        const containerSize = axis === 'x' ? window.innerWidth : window.innerHeight;
        const imageSize = containerSize * this.zoomLevel;

        // Calculate the maximum pan offset
        const maxPan = (imageSize - containerSize) / 2;

        // Clamp the value between -maxPan and maxPan
        return Math.max(-maxPan, Math.min(maxPan, value));
      },
      adjustPanBounds() {
        // Ensure pan values are within bounds after zooming
        this.panX = this.clampPan(this.panX, 'x');
        this.panY = this.clampPan(this.panY, 'y');
      },
      onMapChange(value) {
          this.map = value;
          var target = get_src(this.map, this.date);
          this.imageSource = target;
      },
      onDateChange(value) {
        this.date = value;
        var target = get_src(this.map, new Date(this.date));
        this.imageSource = target;
      },
      updateDateAndImage(hoursOffset) {
        let date = new Date(this.date);
        let tzoffset = new Date().getTimezoneOffset() * 60 * 1000;
        date.setTime(date.getTime() + hoursOffset * 60 * 60 * 1000);
        this.imageSource = get_src(this.map, date);
        date.setTime(date.getTime() - tzoffset);
        this.date = date.toISOString().split(".")[0];
      },
      clickLeft() {
        this.updateDateAndImage(-6);
      },
      clickRight() {
        this.updateDateAndImage(6);
      },
      clickLeftDay() {
        this.updateDateAndImage(-24);
      },
      clickRightDay() {
        this.updateDateAndImage(24);
      },
      get_back() {
        this.date = new Date(
          new Date().setHours(
              Math.floor(new Date().getHours() / 6) * 6,
              0,
              0,
              0
          )
        ).toISOString();
        this.updateDateAndImage(0);
        // this.zoomImage(1);
        this.zoomLevel = 1;
        this.resetPan();
      }
    },
    setup() {
      // const pickerColumns = [
      //   {
      //     name: 'map',
      //     handler: (value) => {
      //       console.log(`You selected  ${value}`);
      //     },
      //   },
      // ];

      return { 
        chevronBack, chevronDown, chevronForward, chevronUp, refreshOutline
      };
    },
  });
</script>

<style scoped>
body {
  background-color: white;
}

.zoom-container {
  position: fixed; /* Make it fixed to cover the entire screen */
  top: 0;
  left: 0;
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  overflow: hidden;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease-in-out; /* Smooth zoom transition */
}

.zoom-container:active {
  cursor: grabbing;
}

.zoom-container img {
  width: auto; /* Stretch the image to fill the container horizontally */
  height: 100%; /* Stretch the image to fill the container vertically */
  object-fit: cover; /* Ensure the image covers the container while maintaining aspect ratio */
  user-select: none; /* Prevent text selection while panning */
  pointer-events: none; /* Disable pointer events on the image */
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

ion-img {
  max-height: 100%;
  height: 100%;
  width: 100%;
  position: fixed;
  bottom: 0;
  transition: transform 0.2s ease-in-out; /* Smooth zoom transition */
}

#img_props {
  max-height: 100%;
  height: 100%;
  width: 100%;
  position: fixed;
  bottom: 0;
}

#my_footer {
  min-height: fit-content;
  max-height: fit-content;
  text-align: center;
  align-self: right;
  position: fixed;
  bottom: 0;
}

#open_picker {
  opacity: 100%;
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
  opacity: 80%;
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

 /* Center */
/* #foot_menu {
  min-width: 400px;
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  bottom: 0;
  background-color: rgba(114, 106, 106, 0.6);
  padding: 1em;
  height: 88px;
  border-radius: 12px;
  border-color: white;
  border-style: solid;
  border-width: thin;
} */

/* Right */
#foot_menu {
  min-width: 400px;
  position: fixed;
  right: 0;
  /* transform: translate(-50%); */
  bottom: 0;
  background-color: rgba(114, 106, 106, 0.6);
  padding: 1em;
  height: 88px;
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
</style>