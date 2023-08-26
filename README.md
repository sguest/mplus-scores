# Mythic Plus score tool

View information on the highest completed Mythic+ keys across a range of characters

## CORS

This application requires CORS rules to be bypassed, which can be achieved by an extension. Examples for [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/cors-everywhere/) or [Chrome](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino). **Note** it is a bad idea to enable such an addon in general web browsing. Use at your own risk.

Why is this requirement in place? This application queries the WoW armory directly for information, and the armory does not set CORS headers on its responses. This requirement could be avoided by setting up a server-side proxy for such requests. However, since this is primarily intended for use as a personal tool, I have not invested the effort or expense in setting up such a proxy, and the app currently lives under static file hosting on github pages.
