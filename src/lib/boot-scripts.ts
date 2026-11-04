/** Runs in <head> before first paint: restores the saved theme (light is the default). */
export const THEME_SCRIPT = `try{if(localStorage.getItem("mj-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

/**
 * Runs in <head> before first paint.
 * - Adds `intro` (logo curtain) when the visitor lands on the site or reloads, not when moving between its pages.
 * - On reload, always starts at the top: drops the router's saved scroll positions and stops the browser
 *   from restoring the old one. A #hash in the URL is left alone so deep links still work.
 */
export const INTRO_SCRIPT = `try{var d=document.documentElement,n=performance.getEntriesByType("navigation")[0],t=n?n.type:"navigate",same=false;try{same=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(e){}if(t==="reload"||(t==="navigate"&&!same))d.classList.add("intro");if(t==="reload"&&!location.hash){try{history.scrollRestoration="manual"}catch(e){}try{for(var i=sessionStorage.length-1;i>=0;i--){var k=sessionStorage.key(i);if(k&&k.indexOf("tsr-scroll")===0)sessionStorage.removeItem(k)}}catch(e){}scrollTo({top:0,left:0,behavior:"instant"})}}catch(e){}`;
