// @ts-ignore
import { initNavHandler } from './modules/nav';
import Twig from 'twig';
import Caption from './modules/caption';
import Modal from './modules/modal';
import Section from './modules/section';
import { initSlides } from './modules/slides';

const parseData = (tpl: Twig.Template): Node[] => {
  const parser = new DOMParser();

  const { body } = parser.parseFromString(
    tpl.render(),
    'text/html'
  );

  return Array.from(body.children);
}

const fetchTemplate = async (): Promise<Twig.Template | undefined> => {
  try {
    const res = await fetch('src/assets/templates/tpl.twig');
    const data = await res.text();

    return Twig.twig({ data });
  } catch(err) {
    console.error(err);
  }
}

const initApp = () => {
  new Caption({ sel: '.js-title' });
  new Modal({
    btnSel: '.js-modal-btn',
    overlayClass: 'popup-overlay',
    titleSel: null,
    inputSel: null,
    handleOpen: ({ target, overlay }) => {
      const { folder, pics } = target.dataset;

      initSlides({
        folder: String(folder),
        pics: String(pics),
        overlay: overlay.querySelector('.js-modal-content') as HTMLElement
      });
    },
    handleClose: ({ overlay }) => {
      let slider = overlay.querySelector('.js-slides');

      if(!slider) return;

      slider.remove();
      slider = null;
    }
  });
  new Section({ sel: '.js-section' });

  initNavHandler('.js-nav-link');
};

const renderData = async () => {
  const wrapper = document.querySelector<HTMLDivElement>('#app');

  try {
    const tpl = await fetchTemplate();
    const arr = parseData(tpl as Twig.Template);

    arr.forEach(item => wrapper?.append(item));
    initApp();
  } catch(err) {
    console.error(err);
  }
};

const init = () => {
  import.meta.env.VITE_APP_ENV === 'development' ? renderData() : initApp();
};

export {
  init
};
