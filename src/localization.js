const salusTextOriginals=new WeakMap();
const salusAttributeOriginals=new WeakMap();
function salusTranslate(text, language) {
  if(!String(language||'en').toLowerCase().startsWith('da'))return text;
  const translations=SALUS_TRANSLATIONS.da;
  const keys=Object.keys(translations).sort((a,b)=>b.length-a.length);
  const pattern=new RegExp(keys.map(key=>key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  return text.replace(pattern,key=>translations[key]);
}
function salusLocalize(root,language) {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode,parent=node.parentElement;
    if(!parent || parent.closest('style,#name,#actual,#target,#humidity') ||
       (parent.tagName==='OPTION' && /^(climate|select|input_text|automation)\./.test(parent.value)))continue;
    if(!salusTextOriginals.has(node))salusTextOriginals.set(node,node.data);
    const translated=salusTranslate(salusTextOriginals.get(node),language);
    if(node.data!==translated)node.data=translated;
  }
  for(const element of root.querySelectorAll('[aria-label],[title],[placeholder]')){
    let attributes=salusAttributeOriginals.get(element);
    if(!attributes){attributes={};salusAttributeOriginals.set(element,attributes);}
    for(const key of ['aria-label','title','placeholder']){
      const value=element.getAttribute(key);if(value===null)continue;
      const previous=attributes[key];
      const original=previous && value===previous.translated ? previous.original : value;
      const translated=salusTranslate(original,language);
      attributes[key]={original,translated};
      if(translated!==value)element.setAttribute(key,translated);
    }
  }
}

function salusComfortMetadata(hass, config, comfort) {
  if(!config.comfort_state)return comfort?.attributes || {};
  let memory;
  try {memory=JSON.parse(hass.states[config.comfort_state]?.state || '{}');}
  catch {memory={};}
  const iso=value=>Number.isFinite(value)&&value>0?new Date(value*1000).toISOString():null;
  const phases={active:'running',starting:'starting',stopping:'stopping',cooldown:'cooldown',idle:null};
  const reasons={minimum:'Minimum runtime is protected.',outdoor_cold:'Outdoor temperature is still below the stop threshold.',
    outdoor_missing:'Outdoor temperature is unavailable; the room period was extended.',room_hold:'This room is held by its own minimum temperature.',
    room_missing:'The room temperature is unavailable; only this room was extended.',room_maximum:'The upper room temperature limit stopped comfort.',
    warm:'The period ended and it is warm enough outside.',manual:'A device or manual change ended ownership.',
    timeout:'The requested change was not confirmed. Check the device.',adopted:'The automation adopted already-active comfort.'};
  const automation=config.comfort_automation && hass.states[config.comfort_automation];
  const phase=phases[memory.p] || null;
  const ownsActive=phase==='running' && comfort?.state===memory.l;
  return {comfort_phase:phase,comfort_rule:config.comfort_automation || null,
    comfort_automation_enabled:automation?automation.state==='on':null,
    comfort_observed_on_at:ownsActive?iso(memory.s || (memory.m?memory.q:0)):null,comfort_on_time_basis:memory.m?'already_active':'observed_transition',
    comfort_last_off_at:iso(memory.x),comfort_period_started_at:ownsActive?iso(memory.s):null,comfort_adopted:!!memory.m,
    comfort_next_check_at:phase==='running' && (!automation || automation.state==='on')?iso(memory.d):null,
    comfort_start_temperature_c:memory.t,comfort_last_reason:reasons[memory.r] || '',
    comfort_start_evidence:Number.isFinite(memory.t)?{source_mode:'forecast',temperature_c:memory.t,minimum_at:iso(memory.a),
      fetched_at:iso(memory.f),outdoor_at_start_c:memory.o,start_below_c:memory.b}:null};
}
