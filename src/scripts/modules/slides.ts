import Swiper from "swiper";
import Twig from 'twig';
import Utils from "../utils";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const galleryPath = 'src/assets/gallery/';

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

export const handleSlides = ({ sliderSel, carouselSel }: Record<string, string>) => {
  const sliderItems = Array.from(document.querySelectorAll(sliderSel));
  const carouselItems = Array.from(document.querySelectorAll(carouselSel));

  const slider: Swiper[] = sliderItems.map(() => handleSlider(sliderSel));
  const carousel: Swiper[] = carouselItems.map(() => handleCarousel(carouselSel));

  return {
    carousel,
    slider
  };
};


const renderSlides = ({ folder, pics }: Record<'folder' | 'pics', string>): HTMLElement[] => {
  if(!pics) return [];

  const pictures: string[] = JSON.parse(pics).map((name: string) => `${galleryPath}${folder}/img_${name}.jpg`);
  const slides = pictures.map((pic: string) => {
    const img = document.createElement('img');
    const slide = document.createElement('div');

    img.alt = '';
    img.src = pic;
    img.classList.add('swiper-img');

    slide.classList.add('swiper-slide');
    slide.append(img);

    return slide;
  });

  return slides;
}

export const initSlides = async ({ folder, pics, overlay }: Record<'folder' | 'pics', string> & { overlay: HTMLElement }) => {
  try {
    const tpl = await Utils.fetchTemplateData('swiper-slides');
    const wrapper = Utils.parseData<string>({
      data: '',
      tpl: tpl as Twig.Template,
      rowSel: '.js-slides'
    });
    const slides = renderSlides({ folder, pics });
    const container = wrapper.querySelector('.js-slides-wrapper');

    if(!container) return;

    slides.forEach((slide: HTMLElement) => container.append(slide));
    overlay.append(wrapper);

    handleSlider('.js-slides');
  } catch(err) {
    console.error(err);
  }
};

export const slidesConfig = {
  sliderSel: '.js-slides',
  carouselSel: '.js-carousel'
};
