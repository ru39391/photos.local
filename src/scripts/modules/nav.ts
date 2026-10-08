const scrollToTarget = (target: HTMLElement) => {
  const { href } = target.dataset;

  if(!href) {
    return;
  }

  let startTime = 0;
  const duration = 1000;
  const section = document.querySelector(href) as HTMLElement;
  const windowPosition = window.scrollY;
  const scrollHeight = section.offsetTop - windowPosition;

  const handleAnimation = (currTime: number) => {
    if(!startTime) {
      startTime = currTime;
    }

    const timeElapsed = currTime - startTime;
    const progress = timeElapsed / duration;
    const easedProgress = progress * (2 - progress);

    window.scrollTo(0, windowPosition + scrollHeight * easedProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(handleAnimation);
    }
  }

  requestAnimationFrame(handleAnimation);
}

const initNavHandler = (sel: string) => {
  const navBtns = Array.from(document.querySelectorAll(sel)) as HTMLElement[];

  if(!navBtns.length) {
    return;
  }

  navBtns.forEach(
    (btn) => {
      btn.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        event.preventDefault();
        scrollToTarget(target);
      })
    }
  );
}

export {
  initNavHandler
}
