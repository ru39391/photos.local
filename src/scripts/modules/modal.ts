import Twig, { type Template } from 'twig';
import { STATE_MOD, TPL_URL } from '../utils';

export type TModalOptions = {
  btnSel?: string;
  modalBtns?: HTMLElement[];
  overlayClass: string;
  titleSel?: string | null;
  inputSel?: string | null;
  handleOpen: ((data: Record<'target' | 'overlay', HTMLElement>) => void) | null;
  handleClose: ((data: Record<'overlay', HTMLElement>) => void) | null;
};

export type TTemplateData = {
  tpl: Template | undefined;
  isSucceed: boolean;
};

class Modal {
  titleSel: string | null = null;
  inputSel: string | null = null;
  btnSel: string = '.js-modal-btn';
  btnCloseSel: string = '.js-modal-close';
  classMod: string = STATE_MOD.visible;
  modalClass: string = 'popup';
  overlayClass: string = 'popup-overlay';
  modalOverlayClass: string = 'js-modal-overlay';
  modalOverlay: HTMLElement | null = null;
  btnClose: HTMLElement | null = null;
  modalBtns: HTMLElement[] = [];
  popups: HTMLElement[] = [];
  isModalPlain: boolean = false;
  handleOpen: (({ target, overlay }: Record<'target' | 'overlay', HTMLElement>) => void) | null = null;
  handleClose: (({ overlay }: Record<'overlay', HTMLElement>) => void) | null = null;

  constructor(options: TModalOptions) {
    this.init(options);
  }

  init(options: TModalOptions) {
    const {
      btnSel,
      modalBtns,
      overlayClass,
      titleSel,
      inputSel
    } = options;

    if(btnSel) this.btnSel = btnSel;

    this.titleSel = String(titleSel);
    this.inputSel = String(inputSel);
    this.overlayClass = overlayClass;
    this.modalBtns = modalBtns || Array.from(document.querySelectorAll(this.btnSel));

    this.revealModals();

    if (options.handleOpen) this.handleOpen = options.handleOpen;
    if (options.handleClose) this.handleClose = options.handleClose;

    if (!this.modalBtns.length) {
      return;
    }

    this.bindEvents();
  }

  setTplPath(value: string = this.modalClass) {
    return `${TPL_URL}/${value}.twig`;
  }

  handleModalClose(modal: HTMLElement) {
    if(!modal) {
      return;
    }

    this.btnClose = modal.querySelector(this.btnCloseSel) as HTMLElement;
  }

  setModalTitle(modal: HTMLElement, caption: string) {
    if(!modal) {
      return;
    }

    /*
    const title = this.titleSel ? modal.querySelector(this.titleSel) as HTMLElement : null;

    if(title && caption) title.textContent = caption;
    */
    const input = this.inputSel ? modal.querySelector(this.inputSel) as HTMLInputElement : null;

    if(input && caption) input.value = caption;
  }

  checkModalData(id: string, diff: number = 5): boolean {
    const timeStamp = localStorage.getItem(id);

    if(!timeStamp) return true;

    const currTimeStamp = Math.floor(Date.now() / 1000);

    return Math.floor(Math.abs(currTimeStamp - Number(timeStamp)) / 60) >= diff;
  }

  setModalData(target: HTMLElement) {
    const { dataset } = target;

    if(!Number(dataset.timeout)) {
      return;
    }

    const timeStamp = Math.floor(Date.now() / 1000);

    localStorage.setItem(target.id, timeStamp.toString());
  }

  hideModal(currentTarget: HTMLElement | null) {
    if(!currentTarget) {
      return;
    }

    this.setModalData(currentTarget);

    [currentTarget, this.modalOverlay].forEach(
      (item) => {
        item?.classList.remove(this.classMod);
        item?.removeEventListener('click', (this.closeModal as EventListener).bind(this));

        if(!this.isModalPlain) {
          item?.remove();
          item = null;
        }
      }
    );

    document.body.style.overflow = '';
  }

  closeModal(event: MouseEvent) {
    const { target, currentTarget } = {
      target: event.target as HTMLElement,
      currentTarget: event.currentTarget as HTMLElement,
    };

    if(target.parentElement === currentTarget || target === this.btnClose) {
      this.hideModal(currentTarget);

      if(this.handleClose) {
        this.handleClose({ overlay: this.modalOverlay as HTMLElement });
      }
    }
  }

  renderData(item: HTMLElement | null) {
    if(!item) {
      return;
    }

    //const btn = item.querySelector(this.btnSel);

    this.modalOverlay = document.createElement('div');

    [
      this.overlayClass,
      this.modalOverlayClass,
      this.classMod
    ].forEach(className => this.modalOverlay?.classList.add(className as string));

    this.handleModalClose(item as HTMLElement);
    this.modalOverlay.addEventListener('click', (this.closeModal as EventListener).bind(this));
    this.modalOverlay.append(item);
    document.body.append(this.modalOverlay);
    document.body.style.overflow = 'hidden';
  }

  parseData(data: Record<string, string>, tpl: Template, itemClass = this.modalClass): HTMLElement | null {
    const parser = new DOMParser();
    const { body } = parser.parseFromString(tpl.render(data), 'text/html');

    return body.querySelector(`.${itemClass}`);
  }

  async fetchTemplate(tplPath: string): Promise<TTemplateData> {
    let tplData: TTemplateData = { tpl: undefined, isSucceed: false };

    try {
      const res = await fetch(tplPath);
      const data = await res.text();

      tplData = { tpl: Twig.twig({ data }), isSucceed: true };
    } catch(err) {
      console.error(err);
    }

    return tplData;
  }

  openModal(id: string, title: string, target?: HTMLElement) {
    if(!id) {
      return;
    }

    this.isModalPlain = true;
    this.modalOverlay = document.querySelector(`#${id}`);
    this.handleModalClose(this.modalOverlay as HTMLElement);
    this.setModalTitle(this.modalOverlay as HTMLElement, title);
    this.modalOverlay?.classList.add(this.classMod);
    this.modalOverlay?.addEventListener('click', (this.closeModal as EventListener).bind(this));
    document.body.style.overflow = 'hidden';

    if(this.handleOpen) {
      this.handleOpen({
        target: target as HTMLElement,
        overlay: this.modalOverlay as HTMLElement
      });
    }
  }

  showModal(event: MouseEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const { dataset } = target;

    this.isModalPlain = false;

    if(dataset.target) {
      this.openModal(dataset.target, dataset.title as string, target);
    }
  }

  revealModals() {
    this.popups = [...Array.from(document.querySelectorAll(`.${this.overlayClass}`)) as HTMLElement[]].filter(({ dataset }) => Number(dataset.timeout) > 0);

    this.popups.forEach(popup => {
      const { dataset, id } = popup;
      const isModalRevealed = this.checkModalData(id, Number(dataset.diff));

      if(!isModalRevealed) return;

      setTimeout(() => {
        this.openModal(id, '');
      }, Number(dataset.timeout));
    });
  }

  bindEvents() {
    this.modalBtns.forEach(btn => btn.addEventListener('click', (this.showModal as EventListener).bind(this)));
  }
}

export default Modal;
export type TModal = Modal;
