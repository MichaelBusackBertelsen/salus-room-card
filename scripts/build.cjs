const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const languages=Object.fromEntries(['en','da'].map(lang=>[lang,JSON.parse(fs.readFileSync(path.join(root,'translations',lang+'.json'),'utf8'))]));
const notice='/*\n'+fs.readFileSync(path.join(root,'LICENSE'),'utf8')+'\n'+fs.readFileSync(path.join(root,'NOTICE'),'utf8')+'*/\n';
fs.writeFileSync(path.join(root,'salus-room-card.js'),notice+'const SALUS_TRANSLATIONS='+JSON.stringify(languages)+';\n'+fs.readFileSync(path.join(root,'src/localization.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/salus-room-card.js'),'utf8'));
