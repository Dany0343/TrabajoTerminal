if(!self.define){let e,s={};const a=(a,t)=>(a=new URL(a+".js",t).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(t,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let i={};const r=e=>a(e,c),d={module:{uri:c},exports:i,require:r};s[c]=Promise.all(t.map((e=>d[e]||r(e)))).then((e=>(n(...e),i)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/1.png",revision:"223226998a9cb21d1113adb980f72b7f"},{url:"/10.jpg",revision:"8b980cb1f2a35dea38e4101439ea89fb"},{url:"/2.png",revision:"838dd3d7797bd4807fb457363609b535"},{url:"/3.jpg",revision:"209c0b18d9ae3a1d4d2b5b6122d6adbf"},{url:"/4.jpg",revision:"9978b134f68bf0de3994196b61828587"},{url:"/5.jpg",revision:"3d39dd33a1dc9273856c9ece837913ed"},{url:"/6.jpg",revision:"20ecb1f45d99db1f446bf22190b0cd13"},{url:"/7.jpg",revision:"0c99d5571166dddda4c052c39b1e1d66"},{url:"/8.jpg",revision:"40aa177eb456828c011ac402bfdb3ae6"},{url:"/9.jpg",revision:"575424adf50a125c5c466f7645281c2a"},{url:"/Ajolote.png",revision:"5613c0e18ccf4e1059938a0c1c06c2e7"},{url:"/_next/app-build-manifest.json",revision:"d8b36a9f3b7fd28c9a789d427e6e2b2d"},{url:"/_next/static/chunks/0e5ce63c-2658b79b1e87caee.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/117-47a08b55a08e4040.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/145-be3a1ff01fc89db3.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/156.eeca7d4b4a63918b.js",revision:"eeca7d4b4a63918b"},{url:"/_next/static/chunks/158-bf16b7d4a1d5307f.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/164f4fb6-3ba48d479cf912e0.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/166.f59346a1de66aa0c.js",revision:"f59346a1de66aa0c"},{url:"/_next/static/chunks/251.b4a1c321aefafbb2.js",revision:"b4a1c321aefafbb2"},{url:"/_next/static/chunks/257-fea29cab35ab7905.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/605-b79569291f1e07af.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/646-451f80784f44ac83.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/674-00699e9ce76394e2.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/684-068b7b2cefb27646.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/75-1273b81c43d690f9.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/812-fcedb0b1274a6406.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/853-a2b8e6ae070d3d18.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/986-472ac53b1ae683cf.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/ad2866b8-1b5280da7a09469f.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/_not-found/page-7fb652029ab8153e.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/ajolotaries/page-8a24835ed0f377cd.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/alerts/page-546bbb47c1c66df8.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/auth/login/page-b5ecbdfc13b008c8.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/auth/register/page-0766b84357d0127b.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/axolotls/page-635ebb7b9d8c9a2f.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/layout-7eb110359897ddf9.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/measurements/page-17e73a1a76594a55.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/page-8e2bd566dcd828d0.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/profile/page-2187b1e18f6b7650.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/sensors/page-a11752bd81b24ac0.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/app/tanks/page-6256650cd6ade3aa.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/bc98253f.5c1775ce46fd6ee5.js",revision:"5c1775ce46fd6ee5"},{url:"/_next/static/chunks/d0deef33.414f5e0355024f0b.js",revision:"414f5e0355024f0b"},{url:"/_next/static/chunks/fd9d1056-fe992f465c928a17.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/main-app-9e11ba2f9a17e7dc.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/main-facfc5cd6ec101b5.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/pages/_app-15e2daefa259f0b5.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/pages/_error-28b803cb2479b966.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-d2bbb2baa947c682.js",revision:"jUYERmtdr3IwCx3h9drU1"},{url:"/_next/static/css/a19d9829262c61d2.css",revision:"a19d9829262c61d2"},{url:"/_next/static/css/fc1c9daac70c093b.css",revision:"fc1c9daac70c093b"},{url:"/_next/static/jUYERmtdr3IwCx3h9drU1/_buildManifest.js",revision:"172e769da91baa11de9b258fb2d92f86"},{url:"/_next/static/jUYERmtdr3IwCx3h9drU1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/layers-2x.9859cd12.png",revision:"9859cd12"},{url:"/_next/static/media/layers.ef6db872.png",revision:"ef6db872"},{url:"/_next/static/media/marker-icon.d577052a.png",revision:"d577052a"},{url:"/ajolotes.png",revision:"f96412318b70612bd4c1fa484404f577"},{url:"/ecocasa.png",revision:"92e543354cb131e41a75a0895f7739db"},{url:"/ecocasa_stock1.png",revision:"6fd39033fdb9fec54e223fd9fa746d75"},{url:"/ecocasa_stock2.png",revision:"f4ded5654d17878e2a45413ecb9f3729"},{url:"/ecocasa_stock3.png",revision:"a477a7c54c0488d4541d0875a187176c"},{url:"/ecocasa_stock4.png",revision:"c4a902f3b9403c96721aed39df217e89"},{url:"/logoAjolotarios.jpeg",revision:"1c7f06222ce1abd23efbaf79b7fdfff2"},{url:"/manifest.json",revision:"b6e2e5d0fd9cccda91c74c505d142e89"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));