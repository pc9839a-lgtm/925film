import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const insights = path.join(root, 'insights');
const manifest = JSON.parse(fs.readFileSync(path.join(insights,'content-index.json'), 'utf8'));
const errors = [];
const read = p => fs.readFileSync(p,'utf8');
const base = manifest.canonical_origin + manifest.site_path;
const articleRoot = base + 'insights/';
const sitemap = read(path.join(root,'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1]);
const list = read(path.join(insights,'index.html'));
const home = read(path.join(root,'index.html'));
const titles = new Set(), slugs = new Set(), intents = new Set();
const assert = (v,msg) => { if(!v) errors.push(msg); };
const checkPage = (html,canonical,label) => {
 const titlesFound=[...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map(x=>x[1].trim());
 const h1s=[...html.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;
 assert(titlesFound.length===1 && titlesFound[0].length>=10,label+': title invalid');
 assert(!titles.has(titlesFound[0]),label+': duplicated title');
 titles.add(titlesFound[0]);
 assert(h1s===1,label+': h1 count '+h1s);
 assert(html.includes('rel="canonical" href="'+canonical+'"'),label+': canonical incorrect');
 assert(html.includes('name="description"'),label+': missing description');
 assert(!/<meta[^>]*name=["']robots["'][^>]*noindex/i.test(html),label+': noindex');
 assert(html.includes('og:title')&&html.includes('og:description'),label+': OG missing');
 assert(locs.includes(canonical),label+': missing sitemap URL');
 for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
  try{JSON.parse(m[1])}catch(e){errors.push(label+': invalid JSON-LD')}
 }
 const links=[...html.matchAll(/href="(\/peopleent\/[^"#?]*)"/g)].map(m=>m[1]);
 for(const href of links){
   const local=path.join(root,href.slice('/peopleent/'.length),'index.html');
   assert(fs.existsSync(local),label+': internal broken link '+href);
 }
};
assert(new Set(locs).size===locs.length,'Duplicate sitemap URLs');
assert(home.includes('href="/peopleent/insights/"'),'Homepage missing insights navigation');
checkPage(list,articleRoot,'insights listing');
for(const item of manifest.posts){
 assert(!slugs.has(item.slug),'Duplicate slug: '+item.slug);
 slugs.add(item.slug);
 assert(!intents.has(item.intent),'Duplicate exact intent: '+item.intent);
 intents.add(item.intent);
 const p=path.join(insights,item.slug,'index.html');
 if(!fs.existsSync(p)){errors.push('Missing page '+p);continue;}
 const html=read(p),url=articleRoot+item.slug+'/';
 checkPage(html,url,item.slug);
 assert(list.includes('href="/peopleent/insights/'+item.slug+'/"'),item.slug+': missing listing card');
 const body=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 assert(body.length>1600,item.slug+': substantial content required');
 assert(item.sources?.length>=2,item.slug+': two or more reference links required');
 for(const u of item.sources) assert(html.includes('href="'+u+'"'),item.slug+': cited reference absent '+u);
}
const folders=fs.readdirSync(insights,{withFileTypes:true}).filter(d=>d.isDirectory()&&fs.existsSync(path.join(insights,d.name,'index.html'))).map(d=>d.name);
for(const slug of folders) assert(slugs.has(slug),'Unregistered guide page: '+slug);
if(errors.length){console.error('PEOPLEENT SEO CHECK FAILED\n'+errors.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('PEOPLEENT SEO CHECK PASS: '+manifest.posts.length+' guide(s), '+locs.length+' sitemap URLs, valid canonical / titles / links');
