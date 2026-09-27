// Browser extensions can annotate server-rendered elements before React hydrates.
// Next.js runs this module synchronously before hydration, so remove only the
// known extension marker and keep genuine hydration errors visible.
document.querySelectorAll('[bis_skin_checked]').forEach(element => {
  element.removeAttribute('bis_skin_checked');
});
