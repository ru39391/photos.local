export type TCaptionOptions = {
  sel: string;
};

class Caption {
  index: number = 0;
  captionsList: string[] = [];
  textRowsList: HTMLElement[] = [];

  constructor(options: TCaptionOptions) {
    this.init(options);
  }

  init(options: TCaptionOptions) {
    const { sel } = options;

    this.textRowsList = Array.from(document.querySelectorAll(sel));

    if (!this.textRowsList.length) {
      return;
    }

    this.captionsList = this.textRowsList.map((item) => {
      const { value } = item.dataset;

      return value as string;
    });

    this.handleCaptionsList();
  }

  handleCaption(item: HTMLElement, value: string, clb: Function) {
    let i = 0;

    const typeStr = () => {
      if (i < value.length) {
        item.textContent += value.charAt(i);
        i++;
        setTimeout(typeStr, 90);
      } else if (clb) {
        clb();
      }
    };

    typeStr();
  }

  handleCaptionsList() {
    if(this.index < this.textRowsList.length) {
      this.handleCaption(
        this.textRowsList[this.index],
        this.captionsList[this.index],
        () => {
          this.index++;
          this.handleCaptionsList()
        }
      )
    }
  }
}

export default Caption;
