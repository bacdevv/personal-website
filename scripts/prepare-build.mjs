import {rm} from 'node:fs/promises';
// Never carry old search fragments into a fresh deployment after unpublishing.
await rm('public/pagefind',{recursive:true,force:true});
await import('./prepare-images.mjs');
