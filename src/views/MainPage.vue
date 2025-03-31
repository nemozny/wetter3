<style lang="css" scoped>
@import '../theme/MainPage.css';
</style>

<script lang="ts" src='../script/MainPage.ts'>
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
        <ion-grid class="ion-no-padding">
          <ion-row class="ion-align-items-center">
            <ion-col size="auto">
              <ion-buttons>
                <ion-menu-button></ion-menu-button>
              </ion-buttons>
            </ion-col>
            <ion-col class="ion-text-center">
              <ion-title>WETTER3</ion-title>
            </ion-col>
            <ion-col size="auto" class="ion-text-right">
              <ion-text><sub>Map timestamp in local time</sub></ion-text><br />
              <ion-text id="current_date"></ion-text>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="scrollable-content" color="light" scroll="true">
      <swiper-container
        init="false"
        :slides-per-view="1"
        :space-between="0"
        :navigation="true"
        :grab-cursor="true"
        :keyboard="true"
        :virtual="true"
        :zoom="true"
        :lazy="true"
        :effect="'coverflow'"
      >
      </swiper-container>        
    
    </ion-content>
    <ion-footer id="my_footer" class="ion-no-border ion-fixed">

    <ion-grid :fixed="true" class="ion-no-padding">
      <ion-segment @ion-change="onSegmentChange($event)" value="maps" mode="ios">
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
                <ion-list :inset="true" class="dark" mode="ios">
                  <ion-item class="dark">
                    <ion-select
                      aria-label="Maps"
                      interface="modal"
                      placeholder="Select weather map"
                      @ionChange="onMapChange($event.detail.value)"
                      label-placement="stacked"
                      justify="end"
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
