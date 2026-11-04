import { LOGO_WHITE_URL } from "./data";

/**
 * Logo intro curtain.
 * It only plays when the visitor lands on the site (typed URL, bookmark, link from another site)
 * or reloads the page. The inline script in <head> adds `intro` to <html> in those cases.
 * Moving between pages of the site never shows it.
 */
export function PageCurtain() {
  return (
    <div id="page-curtain" className="page-curtain curtain-out" aria-hidden="true">
      <img src={LOGO_WHITE_URL} alt="" height={56} decoding="async" className="curtain-mark" />
    </div>
  );
}
