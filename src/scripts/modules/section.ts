import { STATE_MOD } from '../utils/constants';

export type TSectionOptions = {
  sel: string;
};

class Section {
  classMod: string = STATE_MOD.visible;
  sectionsList: HTMLElement[] = [];
  activeSectionsList: HTMLElement[] = [];

  constructor(options: TSectionOptions) {
    this.init(options);
  }

  init(options: TSectionOptions) {
    const { sel } = options;

    this.sectionsList = Array.from(document.querySelectorAll(sel));

    if (!this.sectionsList.length) {
      return;
    }

    this.bindEvents();
  }

  setActiveSection(item: HTMLElement) {
    item.classList.add(this.classMod);
    this.activeSectionsList = [...this.activeSectionsList, item];

    if(this.sectionsList.length === this.activeSectionsList.length) {
      window.removeEventListener('scroll', (this.handleSectionsList as EventListener).bind(this));
    }
  }

  handleSection(item: HTMLElement) {
    const { top, bottom } = item.getBoundingClientRect() as DOMRect;

    if (top <= window.innerHeight / 2 && bottom >= 0) {
      this.setActiveSection(item);
    }
  }

  handleSectionsList() {
    this.sectionsList.forEach(item => this.handleSection(item))
  }

  bindEvents() {
    window.addEventListener('scroll', (this.handleSectionsList as EventListener).bind(this));
  }
}

export default Section;
