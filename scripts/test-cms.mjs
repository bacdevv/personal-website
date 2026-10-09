import {writeFile,readFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const files=[0,1,2].map(i=>`src/content/posts/cms-fixture-${i}.md`);
const run=()=>execFileSync('pnpm',['build'],{stdio:'pipe',env:{...process.env,SITE_URL:'http://localhost:4321',SITE_INDEXABLE:'true'}});
const fixture=(i,draft,title='CMS Vietnamese thử nghiệm')=>`---\ntitle: "${title} ${i}"\ndescription: "CMS compatibility fixture"\npubDatetime: "2026-10-01T08:00:00+07:00"\nmodDatetime: ""\ndraft: ${draft}\nfeatured: false\ntags: [Testing]\n---\n\n## Unicode and code\n\nXin chào. CMS_VALIDATION_FIXTURE_73BF\n\n![Image fixture](/uploads/cms-test.png)\n\n\`\`\`java\nSystem.out.println("hello");\n\`\`\`\n`;
try{
await sharp({create:{width:1600,height:900,channels:3,background:'#0284c7'}}).png().toFile('public/uploads/cms-test.png');
for(let i=0;i<3;i++)await writeFile(files[i],fixture(i,false));
run();
assert(existsSync('dist/blog/2/index.html'),'Pagination page 2 exists');
const html=await readFile('dist/blog/cms-fixture-0/index.html','utf8');assert(html.includes('CMS_VALIDATION_FIXTURE_73BF'));assert(html.includes('/optimized/'));assert(html.includes('srcset='));assert(html.includes('width="1600"'));assert((await readFile('dist/rss.xml','utf8')).includes('cms-fixture-0'));
for(let i=0;i<3;i++)await writeFile(files[i],fixture(i,true,'Edited draft'));
run();assert(!existsSync('dist/blog/cms-fixture-0/index.html'));assert(!(await readFile('dist/rss.xml','utf8')).includes('cms-fixture-0'));assert(!(await readFile('dist/sitemap-0.xml','utf8')).includes('cms-fixture-0'));
console.log('PASS: CMS-shaped ISO dates, blank updated date, Unicode, fenced code, uploaded image optimization, pagination, publish, edit, draft removal from routes/RSS/sitemap.');
}finally{for(const f of files)await rm(f,{force:true});await rm('public/uploads/cms-test.png',{force:true});}
