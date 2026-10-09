import {existsSync} from "node:fs";
if(existsSync(".env")) process.loadEnvFile(".env");
import {appendFile,cp,mkdir} from 'node:fs/promises';
if(process.env.SITE_INDEXABLE!=='true'||(process.env.CF_PAGES_BRANCH&&process.env.CF_PAGES_BRANCH!=='main')||!process.env.SITE_URL||new URL(process.env.SITE_URL).hostname==='example.com')await appendFile('dist/_headers','\n/*\n  X-Robots-Tag: noindex, nofollow\n');
await mkdir('public/pagefind',{recursive:true});await cp('dist/pagefind','public/pagefind',{recursive:true});
