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
import { defineComponent, ref, onMounted, reactive } from 'vue';

register();

// Define interfaces for type safety
interface SlideData {
  step: number;
  date: Date;
  image: string;
  slide: string;
}

interface DefaultMaps {
  [key: string]: string;
}

// Error handling for images
document.addEventListener('error', function(e: Event) {
  const target = e.target as HTMLImageElement;
  if (target.tagName === 'IMG') {
    console.error('Image not found:', target.src);
    target.remove();

    const current_date = document.getElementById("current_date");
    current_date.innerHTML = '';
  }
}, true);

export default defineComponent({
  components: {
    IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter, IonSelectOption, IonSelect, IonList,
    IonGrid, IonRow, IonCol, IonFabButton, IonIcon, IonItem, IonButtons, IonImg, IonSegment, IonSegmentView, IonSegmentButton, IonSegmentContent,
    IonLabel
  },

  setup() {
    const selected_segment = ref<string>("maps");
    const selected_map = ref<string>("1");
    const original_date = ref<Date>(new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      Math.floor(new Date().getUTCHours() / 6) * 6, 0, 0, 0
    )));
    const selected_date = ref<string>(original_date.value.toISOString());
    const swiper_container = ref<HTMLElement | null>(null);
    const swiper = ref<HTMLElement | null>(null);
    const date_element = ref<HTMLElement | null>(null);
    const preload_count = ref<number>(3);
    const default_maps = reactive<DefaultMaps>({ "maps": "1", "analyse": "DWD_Analyse" });
    const slide_list = ref<SlideData[]>([]);
    const current_index = ref<number>(0);

    const base_url_mapping = (): string => {
      if (selected_segment.value === "maps") {
        return "https://www.wetter3.de/Archiv/GFS/";
      }
      if (selected_segment.value === "analyse") {
        if (selected_map.value === "DWD_Analyse") {
          return "https://www.wetter3.de/Archiv/DWD/";
        }
        if (selected_map.value === "UKMet_Analyse") {
          return "https://www.wetter3.de/Archiv/UKMet/";
        }
      }
      return "";
    };

    // Generate the slides which can be then passed to the swiper
    const generate_slides = (selected_date: Date): SlideData[] => {
      // Subtract 2 from every index/date, to go a bit deeper into history and avoid missing images
      const subtract_index = -2;
      
      // Generate initial indices
      const slide_indices = [...Array(preload_count.value).keys()];
  
      // Select the middle slide index
      current_index.value = Math.floor((preload_count.value-1)/2);
  
      // Generate the initial list of slides
      const new_slide_list: SlideData[] = [];
      for (let i = 0; i < slide_indices.length; i++) {
        const index = slide_indices[i] + subtract_index;
        const step = index - current_index.value;
        const date = get_date_adjusted_by_step(selected_date, step);
        const image = get_image_URL(selected_map.value, date);
        const slide = create_img_container(image);
        new_slide_list.push({ 
          step: step,
          date: date,
          image: image,
          slide: slide,
        });
      }
  
      return new_slide_list;
    };

    // Adjust the date by the step in hours
    const get_date_adjusted_by_step = (startDate: Date, step: number): Date => {
      const time_value = startDate.getTime() + step * 6 * 60 * 60 * 1000;
      const adjusted_date = new Date(time_value);

      // Round to the nearest 6 hours
      const rounded_time_value = adjusted_date.setUTCHours(Math.floor(adjusted_date.getUTCHours() / 6) * 6, 0, 0, 0);
      return new Date(rounded_time_value);
    };

    // Generate the image URL based on the selected segment, map and date
    const get_image_URL = (map: string, date: Date): string => {
      const base_url = base_url_mapping();
      return `${base_url}${print_date(date)}_${map}.gif`;
    };

    // Convert date to string in the proper format
    const print_date = (date: Date): string => {
      const temp = new Date(date);
      const pad = (i: number): string => (i < 10 ? "0" + i : "" + i);
      const year = selected_segment.value == "analyse" ? temp.getUTCFullYear() % 100 : temp.getUTCFullYear();
      return year + pad(1 + temp.getUTCMonth()) + pad(temp.getUTCDate()) + pad(temp.getUTCHours());
    };

    // Create the image container for the swiper slide
    const create_img_container = (src: string): string => {
      return `
        <div class="swiper-zoom-container">
          <img 
            src="${src}" 
            width="100%" 
            loading="lazy" 
            alt="Weather Map" 
          />
          <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </div>`;
    };

    // Track current slide
    const track_current_slide = (index: number): void => {
      const current_slide_data = slide_list.value[index];
      const current_date = current_slide_data.date;
      if (date_element.value) {
        // Clear any existing content in date_element
        date_element.value.innerHTML = '';

        // Create a new <sub> element
        const subElement = document.createElement('sub');
        subElement.textContent = new Date(current_date).toLocaleString();

        // Append the <sub> element to date_element
        date_element.value.appendChild(subElement);
      }
    };

    // Slide change event handler
    const slideChangeTransitionEnd = (): void => {
      if (swiper.value.destroyed) return;
      if (swiper.value.virtual.slides.length === 0) return;

      const currentIndex = swiper.value.activeIndex;
      current_index.value = currentIndex;

      // If the current index is the first slide
      if (currentIndex === 0) {
        console.log("First slide reached, generating new image...");
        const current_slide_data = slide_list.value[0];
        const new_step = current_slide_data.step - 1;
        const new_date = get_date_adjusted_by_step(original_date.value, new_step);
        const new_image = get_image_URL(selected_map.value, new_date);
        const new_slide = create_img_container(new_image);
        
        swiper.value.virtual.prependSlide(new_slide);
        slide_list.value.unshift({
          step: new_step,
          date: new_date,
          image: new_image,
          slide: new_slide,
        });

        swiper.value.updateSlides();
        current_index.value = currentIndex + 1;

      // If the current index is the last slide
      } else if (currentIndex === swiper.value.virtual.slides.length - 1) {
        console.log("Last slide reached, generating new image...");
        const current_slide_data = slide_list.value[slide_list.value.length - 1];
        const new_step = current_slide_data.step + 1;
        const new_date = get_date_adjusted_by_step(original_date.value, new_step);
        const new_image = get_image_URL(selected_map.value, new_date);
        const new_slide = create_img_container(new_image);
        
        swiper.value.virtual.appendSlide(new_slide);
        slide_list.value.push({
          step: new_step,
          date: new_date,
          image: new_image,
          slide: new_slide,
        });

        swiper.value.updateSlides();
      }

      track_current_slide(current_index.value);
    };

    // Refresh slides for a different date
    const refresh_slides_for_date = (date: Date): void => {
      swiper.value.virtual.removeAllSlides();
      slide_list.value = generate_slides(date);
      swiper.value.virtual.appendSlide(slide_list.value.map((slide) => slide.slide));
      swiper.value.virtual.update();
      swiper.value.slideTo(current_index.value, 0, false);  
    };

    // Calculate date based on a reference date and a step in days
    const shift_current_slide_a_day = (step: number): Date => {
      const current_slide_data = slide_list.value[current_index.value];
      const current_date = current_slide_data.date;
  
      const date = new Date(Date.UTC(
        current_date.getUTCFullYear(),
        current_date.getUTCMonth(),
        current_date.getUTCDate() + step,
        Math.floor(current_date.getUTCHours() / 6) * 6, 0, 0, 0
      ));
  
      return date;
    };

    // Button handlers
    const clickLeft = (): void => {
      swiper.value.slidePrev();
    };

    const clickRight = (): void => {
      swiper.value.slideNext();
    };

    const clickLeftDay = (): void => {
      const date = shift_current_slide_a_day(-1);
      refresh_slides_for_date(date);
    };

    const clickRightDay = (): void => {
      const date = shift_current_slide_a_day(1);
      refresh_slides_for_date(date);
    };

    const resetMap = (): void => {
      refresh_slides_for_date(original_date.value);
    };

    const onMapChange = (value: string | number): void => {
      selected_map.value = value.toString();
      refresh_slides_for_date(original_date.value);
    };

    const onSegmentChange = (event: CustomEvent): void => {
      if (!event.detail || !event.detail.value) {
        console.error("Invalid event detail:", event.detail);
        return;
      }

      selected_segment.value = event.detail.value;
      selected_map.value = default_maps[selected_segment.value];
      refresh_slides_for_date(original_date.value);
    };

    onMounted(() => {
      swiper_container.value = document.querySelector('swiper-container');
      if (!swiper_container.value) {
        console.error("Swiper container not found");
        return;
      }

      date_element.value = document.getElementById("current_date");

      const now = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        Math.floor(new Date().getUTCHours() / 6) * 6, 0, 0, 0
      ));
      slide_list.value = generate_slides(now);
      
      const swiper_params = {
        virtual: {
          slides: slide_list.value.map((slide) => slide.slide),
        },
        initialSlide: current_index.value,
        lazy: true,
      };

      Object.assign(swiper_container.value, swiper_params);
      swiper_container.value.initialize();
      swiper.value = swiper_container.value.swiper;
      if (!swiper.value) {
        console.error("Swiper not found");
        return;
      }

      console.log("Swiper initialized with slides:", swiper.value.slides.length, " and switched to index:", current_index.value);

      swiper.value.on('slideChangeTransitionEnd', slideChangeTransitionEnd);
      swiper.value.on('virtualUpdate', () => {
        track_current_slide(current_index.value);
      });
    });

    return {
      selected_segment,
      selected_map,
      selected_date,
      clickLeft,
      clickRight,
      clickLeftDay,
      clickRightDay,
      resetMap,
      onMapChange,
      onSegmentChange,
      chevronBack,
      chevronDown, 
      chevronForward, 
      chevronUp, 
      refreshOutline
    };
  }
});