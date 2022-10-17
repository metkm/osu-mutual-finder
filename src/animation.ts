export const handleBeforeLeave = (element: Element) => {
  const el = element as HTMLElement;
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);

  element.setAttribute("style", `
    left: ${el.offsetLeft - parseInt(marginLeft)}px;
    top: ${el.offsetTop - parseInt(marginTop)}px;
    width: ${width};
    height: ${height};
  `);
}
