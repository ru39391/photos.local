//@ts-nocheck
import Twig from 'twig';
import { TPL_URL } from './constants';

/**
 * Парсинг twig-шаблонов
 */
class Utils {
  /**
   * Получение разметки шаблона
   * @param {string} tpl - название шаблона
   * @returns {Object} объект, содержащий шаблон
   */
  static async fetchTemplateData(tpl: string) {
    try {
      const res = await fetch(`${TPL_URL}/${tpl}.twig`);
      const data = await res.text();

      return Twig.twig({ data });
    } catch(err) {
      console.error(err);
    }
  }

  /**
   * Парсинг шаблона
   * @param {Object} data - данные кнопки для рендеринга шаблона
   * @param {Twig.Template} tpl - шаблон для рендеринга
   * @param {rowSel} string - селектор класса
   * @returns {HTMLElement} разметка группы полей ввода
   */
  static parseData<T>({data, tpl, rowSel}: { data: T; tpl: Twig.Template; rowSel: string; }) {
    const parser = new DOMParser();
    const { body } = parser.parseFromString(tpl.render(data), 'text/html');

    return body.querySelector(rowSel);
  }

  static phoneMask() {
    [].forEach.call(
      document.querySelectorAll('input[type="tel"]'),
      (input: HTMLElement) => {
        let keyCode: number;

        function mask(event: KeyboardEvent) {
          if (!event.keyCode) {
            keyCode = event.keyCode;
          }

          const pos = this.selectionStart;

          if (pos < 3) {
            event.preventDefault();
          }

          let i = 0;
          const matrix = "+7 (___) ___ __ __";
          const def = matrix.replace(/\D/g, "");
          const val = this.value.replace(/\D/g, "");
          let newValue = matrix.replace(/[_\d]/g, (a) =>
            i < val.length ? val.charAt(i++) || def.charAt(i) : a
          );

          i = newValue.indexOf("_");
          if (i !== -1) {
            newValue = newValue.slice(0, i);
          }

          let reg: string | RegExp = matrix
            .substr(0, this.value.length)
            .replace(/_+/g, (a) => `\\d{1,${a.length}}`)
            .replace(/[+()]/g, "\\$&");

          reg = new RegExp(`^${reg}$`);
          if (
            !reg.test(this.value) ||
            this.value.length < 5 ||
            (keyCode > 47 && keyCode < 58)
          ) {
            this.value = newValue;
          }
          if (event.type === "blur" && this.value.length < 5) this.value = "";
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);
      }
    );
  }
}

export * from './api';
export * from './constants';
export * from './types';
export default Utils;
