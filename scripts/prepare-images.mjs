import {readdir,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const manifest={};
await rm('public/optimized',{recursive:true,force:true});await mkdir('public/optimized',{recursive:true});
async function walk(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const file=join(dir,ent.name);if(ent.isDirectory()){await walk(file);continue;}if(!/\.(png|jpe?g|webp|avif)$/i.test(extname(file)))continue;const bytes=await readFile(file),hash=createHash('sha256').update(bytes).digest('hex').slice(0,16);const meta=await sharp(bytes).rotate().metadata();const width=meta.autoOrient?.width||meta.width,height=meta.autoOrient?.height||meta.height;if(!width||!height)throw Error(`Missing dimensions: ${file}`);const widths=[400,760,1200].filter(w=>w<width);widths.push(Math.min(width,1600));const variants=[];for(const w of [...new Set(widths)]){const name=`${hash}-${w}.webp`;await sharp(bytes).rotate().resize({width:w,withoutEnlargement:true}).webp({quality:82}).toFile(`public/optimized/${name}`);variants.push(`/optimized/${name} ${w}w`);}manifest['/'+file.replace(/^public\//,'')]={src:variants.at(-1).split(' ')[0],srcset:variants.join(', '),width,height};}}
await walk('public/uploads');await mkdir('.cache',{recursive:true});await writeFile('.cache/images.json',JSON.stringify(manifest));
