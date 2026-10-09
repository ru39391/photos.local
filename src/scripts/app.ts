// @ts-ignore
import { initNavHandler } from './modules/nav';
import Twig, { Template } from 'twig';
import Caption from './modules/caption';
import Modal from './modules/modal';
import Section from './modules/section';
import { initSlides } from './modules/slides';

const parseData = (tpl: Template): Node[] => {
  const parser = new DOMParser();

  const { body } = parser.parseFromString(
    tpl.render(),
    'text/html'
  );

  return Array.from(body.children);
}

const fetchTemplate = async (): Promise<Template | undefined> => {
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
        folder,
        pics,
        overlay: overlay.querySelector('.js-modal-content')
      });
    }
  });
  new Section({ sel: '.js-section' });

  initNavHandler('.js-nav-link');
};

const renderData = async () => {
  const wrapper = document.querySelector<HTMLDivElement>('#app');

  try {
    const tpl = await fetchTemplate();
    const arr = parseData(tpl as Template);

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
