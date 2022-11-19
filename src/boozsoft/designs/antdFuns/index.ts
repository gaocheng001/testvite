export function getPopupContainer(el, dialogContext, c, d, e) {
  if (window.pageRootDom != null) {
    return window.pageRootDom.value
  }
  if (dialogContext) {
    return dialogContext.getDialogWrap();
  } else {
    return document.body;
  }
}
