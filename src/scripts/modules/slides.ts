import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export const handleSlider = (sel: string): Swiper => new Swiper(sel, {
  modules: [Autoplay, Navigation],
  loop: true,
  slidesPerView: 1,
  spaceBetween: 0,
  grabCursor: true,
  speed: 1000,
  autoplay: {
    delay: 7000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: `${sel} .js-slides-nav-next`,
    prevEl: `${sel} .js-slides-nav-prev`
  },
});

export const handleCarousel = (sel: string): Swiper => new Swiper(sel, {
  modules: [Pagination],
  loop: false,
  slidesPerView: "auto",
  spaceBetween: 0,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    bulletActiveClass: "is-active"
  },
});

export const initSlides = ({ sliderSel, carouselSel }: Record<string, string>) => {
  const sliderItems = Array.from(document.querySelectorAll(sliderSel));
  const carouselItems = Array.from(document.querySelectorAll(carouselSel));

  const slider: Swiper[] = sliderItems.map(() => handleSlider(sliderSel));
  const carousel: Swiper[] = carouselItems.map(() => handleCarousel(carouselSel));

  return {
    carousel,
    slider
  };
};

export const slidesConfig = {
  sliderSel: '.js-slides',
  carouselSel: '.js-carousel'
};
