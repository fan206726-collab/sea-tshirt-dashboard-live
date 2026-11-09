// app.js v2026-09-10a generated 2026-09-10 14:56 CST
(function(){
  "use strict";
  function loadData(cb){
    var s=document.createElement('script');
    s.src='data/dashboard_data.js?_='+Date.now();
    s.onload=cb; s.onerror=cb;
    document.head.appendChild(s);
  }
  function boot(){
    var D = window.DASHBOARD_DATA || {};
  function $(s){return document.querySelector(s);}
  function $$(s){return document.querySelectorAll(s);}
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function text(s){return String(s==null?'':s);}
  // 取路径末段（Windows / POSIX 都兼容），用于把数据里的绝对来源路径显示成文件名
  function baseName(p){var s=String(p==null?'':p);var i=Math.max(s.lastIndexOf('\\'),s.lastIndexOf('/'));return i>=0?s.slice(i+1):s;}
  // 按真实数组长度统计板块规模：表数 / 总行数 / 每表行数（用于 KPI 副标题，算不出就返回 null）
  function sectionStats(v){
    var tables=0, rows=0, sizes=[];
    Object.keys(v||{}).forEach(function(p){
      var m=v[p]||{};
      Object.keys(m).forEach(function(c){ var a=m[c]||[]; tables++; rows+=a.length; sizes.push(a.length); });
    });
    if(!tables) return null;
    var uniq={}; sizes.forEach(function(n){ uniq[n]=1; });
    var keys=Object.keys(uniq);
    return {tables:tables, rows:rows, per:(keys.length===1?sizes[0]:Math.round(rows/tables*10)/10), uniform:keys.length===1};
  }
  function statsSub(st, unit){
    if(!st) return '—';
    return st.tables+' '+(unit||'组')+' × '+(st.uniform?st.per:('均 '+st.per))+' 行';
  }

  // ---------- 信息渠道注脚（2026-10-23）----------
  // 目的：每个板块末尾明确回答「这些数据是从哪些渠道拿到的」。
  // 做法：从**条目自身的真实链接/来源字段**汇总域名，只显示实际出现过的渠道，绝不写死、绝不编造。
  function channelHost(u){
    var s=String(u||'').trim();
    if(!s) return '';
    if(!/^https?:\/\//i.test(s)){          // 裸域名/站点名
      if(/^[A-Za-z0-9][A-Za-z0-9.\-]*\.[A-Za-z]{2,}/.test(s)) return s.split('/')[0].replace(/^www\./,'');
      return '';
    }
    try{ return s.replace(/^https?:\/\//,'').split('/')[0].replace(/^www\./,''); }catch(e){ return ''; }
  }
  function channelNote(items, opts){
    opts=opts||{};
    var cnt={};
    var GATEWAY=/^(www\.)?bing\.com$/i;      // 搜索兜底入口不算「真实渠道」，避免把聚合搜索当成来源
    (items||[]).forEach(function(it){
      if(!it) return;
      var h=channelHost(it.source_url)||channelHost(it.link)||channelHost(it.source);
      if(!h || GATEWAY.test(h)){
        var nm=String(it.source||'').trim();
        if(!h && nm && nm.length<=28 && !/^\d/.test(nm) && !/bing/i.test(nm)) h=nm;
      }
      if(!h || GATEWAY.test(h)) return;
      cnt[h]=(cnt[h]||0)+1;
    });
    var arr=Object.keys(cnt).sort(function(a,b){ return cnt[b]-cnt[a]; });
    if(!arr.length){
      // 无链接型条目（如站内关键词榜）：给出**如实**的渠道说明，不留空
      if(opts.fallback) return el('div','channel-note','<span class="ch-label">📡 信息渠道</span><span class="ch-more">'+esc(opts.fallback)+'</span>');
      return null;
    }
    var shown=arr.slice(0,8);
    var html=shown.map(function(h){ return '<span class="ch-pill">'+esc(h)+' <b>'+cnt[h]+'</b></span>'; }).join('');
    var more=arr.length>shown.length?(' <span class="ch-more">等 '+arr.length+' 个渠道</span>'):'';
    var note=el('div','channel-note','<span class="ch-label">📡 信息渠道</span>'+html+more);
    return note;
  }

  if(D.meta && D.meta.date){
    document.title = 'T恤选品工作台 · ' + D.meta.date;
    $('#report-date').textContent = D.meta.date + ' ' + (D.meta.weekday||'');
    $('#report-date-warn').textContent = D.meta.date;
    $('#updated-at').textContent = D.meta.updated_at || '—';
    var src=$('#report-src-count'); if(src) src.textContent=String((D.live_sources||[]).length||0);
  }

  // ---------- 导航（按 DOM 实际顺序生成，不写死编号）----------
  // 这里只维护「板块 id → 图标/短标签」的展示名；板块顺序、分组、条目数量一律取真实 DOM，
  // 因此删/加板块只改 html，不需要同步改数组下标，也不会出现导航指向已删除元素的情况。
  var SECTION_META={
    'sec-countdown':{icon:'📅',label:'节假日速查'},
    'sec-onlinefest':{icon:'🌐',label:'网络节日'},
    'sec-market':{icon:'📈',label:'市场大盘'},
    'sec-competitor':{icon:'🕵️',label:'竞品爆款监控'},
    'sec-search':{icon:'🔍',label:'搜索关键词'},
    'sec-best':{icon:'🏅',label:'平台爆款'},
    'sec-ip':{icon:'🔥',label:'IP热点'},
    'sec-global':{icon:'🌐',label:'全球趋势'},
    'sec-entertainment':{icon:'🎬',label:'娱乐档期'},
    'sec-hotsearch':{icon:'🔥',label:'实时热搜榜'},
    'sec-news':{icon:'📰',label:'行业新闻'},
    'sec-livetrends':{icon:'⚡',label:'实时热搜'},
    'sec-live':{icon:'📡',label:'数据源清单'},
    'sec-fx':{icon:'💱',label:'汇率天气'}
  };
  var sections=[];
  var navGroups=[];
  Array.prototype.forEach.call($$('.grid-group'),function(grp){
    var list=grp.querySelectorAll('section[id^="sec-"]');
    if(!list.length) return;
    var items=[];
    Array.prototype.forEach.call(list,function(node){
      var meta=SECTION_META[node.id]||{icon:'•',label:String(node.id).replace(/^sec-/,'')};
      sections.push({id:node.id,icon:meta.icon,label:meta.label});
      items.push(node.id);
    });
    var tEl=grp.querySelector('.group-title');
    var title=tEl?String(tEl.textContent||''):'';
    var subEl=tEl?tEl.querySelector('.gt-sub'):null;
    if(subEl) title=title.replace(String(subEl.textContent||''),'');
    title=title.replace(/^[^\u4e00-\u9fa5A-Za-z]+/,'').replace(/\s+/g,' ').trim();
    navGroups.push({title:title||'板块', items:items});
  });
  var nav=$('#nav');
  navGroups.forEach(function(g){
    var ng=el('div','nav-group');
    ng.appendChild(el('div','nav-title',g.title));
    g.items.forEach(function(id){
      var sec=null;
      for(var i=0;i<sections.length;i++){ if(sections[i].id===id){ sec=sections[i]; break; } }
      if(!sec) return;
      var a=el('a',null,'<span class="dot"></span><span>'+esc(sec.icon+' '+sec.label)+'</span>');
      a.href='#'+sec.id;
      a.dataset.target=sec.id;
      // 只接管「左键 + 无修饰键」的点击；中键 / Ctrl+点击 / 右键菜单保留浏览器原生行为（新标签、复制链接）
      a.onclick=function(ev){
        if(ev && (ev.button!==0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey)) return;
        ev.preventDefault(); scrollToSec(sec.id); setActiveNav(sec.id);
        try{ if(history.replaceState) history.replaceState(null,'','#'+sec.id); }catch(e){}
      };
      ng.appendChild(a);
    });
    nav.appendChild(ng);
  });
  // 带 #锚点 首次打开时直接定位到对应板块
  if(location.hash && location.hash.length>1){
    var _h=location.hash.slice(1);
    for(var _i=0;_i<sections.length;_i++){ if(sections[_i].id===_h){ setTimeout(function(){scrollToSec(_h);},60); break; } }
  }
  function scrollToSec(id){var s=$('#'+id); if(s) s.scrollIntoView({behavior:'smooth',block:'start'});}
  function setActiveNav(id){$$('.nav a').forEach(function(a){a.classList.toggle('active',a.dataset.target===id);});}
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting) setActiveNav(en.target.id); });
  },{rootMargin:'-30% 0px -60% 0px'});
  sections.forEach(function(sec){ var s=$('#'+sec.id); if(s) observer.observe(s); });

  // ---------- 抽屉 ----------
  var drawer=$('#drawer'), backdrop=$('#drawer-backdrop'), drawerBody=$('#drawer-body'), drawerClose=$('#drawer-close');
  function openDrawer(){ drawer.classList.add('show'); backdrop.classList.add('show'); document.body.style.overflow='hidden';}
  function closeDrawer(){ drawer.classList.remove('show'); backdrop.classList.remove('show'); document.body.style.overflow='';}
  drawerClose.onclick=closeDrawer; backdrop.onclick=closeDrawer;
  document.addEventListener('keydown',function(e){if(e.key==='Escape') closeDrawer();});

  function drawHeader(title,meta){
    var h=el('div');
    h.appendChild(el('div','d-title',esc(title)));
    var chips=el('div','d-meta');
    (meta||[]).forEach(function(m){ chips.appendChild(el('span','d-chip '+esc(m.type||''), esc(m.text))); });
    h.appendChild(chips);
    return h;
  }
  function drawSection(title,content,cls){
    var sec=el('div','d-section');
    sec.appendChild(el('h3',null,esc(title)));
    if(typeof content==='string') sec.appendChild(el('div','d-text'+ (cls?' '+cls:''), content));
    else sec.appendChild(content);
    return sec;
  }
  function tagify(words){
    var box=el('div','d-tags');
    (words||[]).forEach(function(w){ box.appendChild(el('span','d-tag',esc(w))); });
    return box;
  }
  function hashtagsFrom(text){
    if(!text) return [];
    var out=[];
    text.replace(/#([^\s#]+)/g,function(_,t){ out.push('#'+t); });
    if(out.length) return out;
    var words=text.split(/[,，\s]+/).filter(function(w){return w.length>1 && w.length<20;});
    return words.slice(0,5).map(function(w){return '#'+w.replace(/[()]/g,'');});
  }
  // 数据源地区：新渠道没有 region 字段，从 data_key（如 hot_TH / news_MY）或名称里兜一个出来
  var GEO_LABEL={TH:'泰国',MY:'马来西亚',SG:'新加坡',ID:'印尼',PH:'菲律宾'};
  function regionFromDataKey(it){
    var s=String((it&&(it.data_key||it.name||''))||'');
    var m=s.match(/_?(TH|MY|SG|ID|PH)\b/) || s.match(/\b(TH|MY|SG|ID|PH)\b/);
    if(!m) return '';
    var k=m[1];
    return (GEO_LABEL[k]||k)+' '+k;
  }
  function regionTags(platform,country){
    var tags=[];
    if(platform==='Shopee') tags=tags.concat(['Shopee','ShopeeTH','ShopeeMY','虾皮']);
    else if(platform==='Lazada') tags=tags.concat(['Lazada','LazadaTH','LazadaMY']);
    else if(platform==='TikTok') tags=tags.concat(['TikTok','TikTokShop','TikTokTH','TikTokMY']);
    else tags=tags.concat(['Shopee','Lazada','TikTok']);
    if(String(country||'').indexOf('泰国')>=0 || String(country||'').indexOf('🇹🇭')>=0){
      tags=tags.concat(['Thailand','Thai','ไทย','泰国','TH']);
    }else if(String(country||'').indexOf('马来西亚')>=0 || String(country||'').indexOf('🇲🇾')>=0 || String(country||'').indexOf('马来')>=0){
      tags=tags.concat(['Malaysia','Malaysian','MY','马来西亚','马来','Melayu']);
    }else{
      tags=tags.concat(['Thailand','Thai','ไทย','泰国','Malaysia','Malaysian','MY','马来西亚']);
    }
    return tags;
  }
  function mergeTags(first,second,limit){
    limit=limit||12;
    var seen={}, out=[];
    (first||[]).concat(second||[]).forEach(function(w){ var k=String(w).toLowerCase(); if(!seen[k]){ seen[k]=1; out.push(w); } });
    return out.slice(0,limit);
  }
  function sourceSection(source,link,linkText){
    var box=el('div');
    if(source) box.appendChild(el('p','d-muted',esc(source)));
    if(link){
      var a=el('a','d-link',(linkText||'🔗 查看原始链接')); a.href=link; a.target='_blank'; a.rel='noopener';
      box.appendChild(a);
    }
    return drawSection('来源 / 延伸',box);
  }
  function infoTable(rows){
    var t=el('table','d-table');
    var tb=el('tbody');
    (rows||[]).forEach(function(r){
      var tr=el('tr');
      tr.innerHTML='<td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td>';
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    return t;
  }
  function listBlock(items,cls){
    var u=el('ul',cls||'d-list');
    (items||[]).forEach(function(it){ u.appendChild(el('li',null,esc(it))); });
    return u;
  }
  function noticeBlock(text,cls){return '<div class="'+(cls||'d-warn')+'">'+esc(text)+'</div>';}

  function holidayBizImpact(h){
    var cat=h.category||'', loc=h.location||'';
    var arr=[];
    if(cat.indexOf('王室')>=0) arr.push('王室相关节日：主推蓝/白素雅配色，避免使用受版权与法律保护的王室徽章、肖像；以"致敬/纪念"柔性表达为主。');
    if(cat.indexOf('宗教')>=0||cat.indexOf('佛教')>=0) arr.push('宗教节日期间部分地区酒吧、娱乐场所可能关闭（禁酒日），广告与直播排期应避开敏感时段，印花避免宗教神像直接复制。');
    if(cat.indexOf('国家')>=0||cat.indexOf('独立')>=0||cat.indexOf('国庆')>=0) arr.push('国家庆典：爱国款为核心增量，Jalur Gemilang/大红花/batik 等元素可接受，但需规避政治人物肖像与争议符号。');
    if(cat.indexOf('商业')>=0||cat.indexOf('大促')>=0) arr.push('大促节点：提前 7–14 天备货与预热，平台补贴与直播叠加，适合全品类冲刺与促销梗款。');
    if(cat.indexOf('体育')>=0) arr.push('体育赛事：中性爱国款窗口极短（赛前48h–赛后24h），需快速上架、小批量测款。');
    if(cat.indexOf('气象')>=0) arr.push('气象/灾害：物流时效波动，建议改空运或提前发货；功能速干/透气款需求上升。');
    if(!arr.length) arr.push('常规节点：结合 '+loc+' 用户习惯做主题款，关注倒计时窗口内流量变化。');
    return arr;
  }
  function holidayWindow(h){
    var d=h.days_left;
    if(d==null) return '日期待确认，建议持续关注官方公告。';
    if(d<0) return '已过节点（'+(-d)+' 天前），可沉淀为长尾/怀旧主题款，不必追热点。';
    if(d===0) return '今日节点：适合即时热点款与社媒联动，库存以现货为主。';
    if(d<=3) return '紧急窗口：仅剩 '+d+' 天，仅适合已备货现货快速上架，不做打样。';
    if(d<=14) return '黄金窗口：'+d+' 天，可小批量测款 + 投放预热，验证后再追单。';
    if(d<=30) return '规划窗口：'+d+' 天，建议完成设计打样与备货排期。';
    return '长周期：'+d+' 天，适合纳入季度选品规划，提前锁定面料与产能。';
  }

  function showHolidayDetail(h){
    var body=el('div');
    var meta=[
      {type:'date',text:(h.date||'')},
      {type:'countdown',text:'倒计时 '+(h.days_left==null?'?':h.days_left)+' 天'},
      {text:(h.category||'')},
      {text:(h.location||'')}
    ];
    body.appendChild(drawHeader(h.name,meta));
    body.appendChild(drawSection('节日背景与定义', infoTable([
      ['节日名称', h.name||'—'],
      ['日期', h.date||'—'],
      ['距今天数', (h.days_left==null?'待确认':h.days_left+' 天')],
      ['类别', h.category||'—'],
      ['适用地区', h.location||'—']
    ])));
    body.appendChild(drawSection('传统与习俗（完整说明）', esc(h.tradition||'暂无详细说明')));
    body.appendChild(drawSection('商业影响分析', listBlock(holidayBizImpact(h))));
    body.appendChild(drawSection('T恤印花机会', esc(h.opportunity||'暂无')));
    if(h.terms && h.terms.length){
      var trows=[];
      h.terms.slice(0,5).forEach(function(t){
        trows.push(['🎯 '+(t.name||''), '主题词：'+(t.theme||'—')+'　|　热度：'+(t.heat||'—')]);
        trows.push(['　└ 精准搜索词', (t.query||'—')]);
      });
      body.appendChild(drawSection('主题词 & 精准搜索词（单一主题类目 · 来自「网络节日」）', infoTable(trows)));
    }
    body.appendChild(drawSection('备货与营销时间窗', esc(holidayWindow(h))));
    body.appendChild(drawSection('合规注意事项', noticeBlock('涉及王室/宗教/国家象征的印花，须规避：①王室或国家元首肖像；②受保护徽章与国旗的精确复制用于商业；③宗教神像的直接复制。建议以几何化、抽象化、文化符号再诠释方式表达。','d-warn')));
    body.appendChild(tagify(hashtagsFrom(h.name+' '+(h.opportunity||''))));
    body.appendChild(sourceSection('纪念日数据来自工作台自有信息渠道实时检索。后续接入「竞品爆款监控」板块后，可在此追加官方活动页 / 外链跳转。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showCompetitorDetail(r){
    var body=el('div');
    var meta=[
      {text:(r.platform||'')},{text:(r.country||'')},{text:'排名 #'+(r.rank||'')},
      {type:'date',text:(r.price||'')},{text:'月销 '+(r.monthly_sales||'')},{text:(r.trend||'')}
    ];
    body.appendChild(drawHeader(r.product,meta));
    body.appendChild(drawSection('基础信息', infoTable([
      ['平台 / 市场', (r.platform||'—')+' · '+(r.country||'—')],
      ['榜单排名', '第 '+(r.rank||'?')+' 名'],
      ['价格', r.price||'—'],
      ['月销量', r.monthly_sales||'—'],
      ['趋势信号', r.trend||'—'],
      ['主题', r.theme||'—']
    ])));
    body.appendChild(drawSection('竞品解读', esc('该竞品为 '+(r.country||'')+' '+(r.platform||'')+' 榜单第 '+(r.rank||'?')+' 名，定价 '+(r.price||'—')+'，月销 '+(r.monthly_sales||'—')+'。主题为「'+(r.theme||'未标注')+'」，趋势 '+(r.trend||'—')+'。建议围绕主题做差异化印花或价格带切入，避免同质化价格战。')));
    body.appendChild(drawSection('差异化机会', listBlock([
      '主题拆解：将「'+(r.theme||'未标注')+'」拆为视觉元素 + 文案梗，做原创再诠释。',
      '价格带切入：参考 '+(r.price||'—')+'，可在相邻价位做"加量/升级面料"款。',
      '趋势借力：'+(r.trend||'—')+' 趋势下，提前布局关联长尾词。'
    ])));
    body.appendChild(drawSection('印花机会', esc(r.opportunity||('可开发「'+(r.theme||'')+'」风格的原创印花T恤，规避直接侵权并强化本土文化表达。'))));
    body.appendChild(drawSection('风险与壁垒', esc('头部竞品通常已占搜索与评分心智，新进入需以差异化设计 + 内容种草破圈；若涉及 IP/版权图案须取得授权，避免平台下架。')));
    body.appendChild(tagify(mergeTags(regionTags(r.platform,r.country), hashtagsFrom(r.product+' '+r.theme))));
    body.appendChild(sourceSection('竞品数据来自工作台自有信息渠道实时检索与平台榜单整理。', r.link));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showSearchDetail(r,p,c){
    var body=el('div');
    var meta=[{text:p},{text:c},{text:'排名 #'+(r.rank||'')},{text:(r.trend||'')},{type:'date',text:'热度 '+(r.heat||'')}];
    body.appendChild(drawHeader(r.cn||r.word,meta));
    body.appendChild(drawSection('搜索词信息', infoTable([
      ['搜索词（原文）', r.word||'—'],
      ['中文释义', r.cn||'—'],
      ['平台 / 市场', p+' · '+c],
      ['排名', '第 '+(r.rank||'?')+' 名'],
      ['趋势', r.trend||'—'],
      ['热度信号', r.heat||'—']
    ])));
    body.appendChild(drawSection('市场解读', esc('「'+(r.cn||r.word)+'」在 '+p+' '+c+' 搜索排名中位列第 '+(r.rank||'?')+'，趋势 '+(r.trend||'—')+'，热度 '+(r.heat||'—')+'。该类搜索词反映用户主动需求，是标题、主图文案与印花选题的高价值输入。')));
    body.appendChild(drawSection('标题与埋词建议', listBlock([
      '标题必含：'+(r.word||'')+' / '+(r.cn||'')+'，前置核心词。',
      '搭配属性词：材质(100% Cotton / 200GSM)、场景(Unisex / Oversize)、风格(Streetwear)。',
      '规避堆砌：自然语序，避免触发平台关键词违规。'
    ])));
    body.appendChild(drawSection('印花机会', esc('围绕该关键词设计相关印花或标题埋词，例如「'+(r.cn||r.word)+'」主题T恤/文化梗款，借搜索红利快速起量。')));
    body.appendChild(tagify(mergeTags(regionTags(p,c), hashtagsFrom(r.word+' '+r.cn))));
    body.appendChild(sourceSection('搜索排名数据来自工作台自有信息渠道实时检索。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showBestDetail(r,p,c){
    var body=el('div');
    var meta=[{text:p},{text:c},{text:'排名 #'+(r.rank||'')},{type:'date',text:(r.price||'')},{text:(r.theme_cat||r.type||'')},{text:(r.trend||'')}];
    body.appendChild(drawHeader(r.theme||r.cn||r.product,meta));
    body.appendChild(drawSection('爆款信息', infoTable([
      ['爆款（原文）', r.product||'—'],
      ['中文', r.cn||'—'],
      ['精确主题', r.theme||'—'],
      ['平台 / 市场', p+' · '+c],
      ['排名', '第 '+(r.rank||'?')+' 名'],
      ['价格区间', r.price||'—'],
      ['类型', (r.type_show||r.type||'—')+(r.category==='adjacent'?'（相邻服饰类目）':'')],
      ['销量/热度', r.signal||'—'],
      ['趋势', r.trend||'—'],
      ['信息渠道', (String(r.link||'').trim()
          ? '<a href="'+esc(String(r.link).trim())+'" target="_blank" rel="noopener">'+esc(String(r.link).trim())+'</a>'
          : '') + (String(r.source||'').trim() ? (String(r.link||'').trim()?'<br>':'')+esc(r.source) : '') || '—']
    ])));
    if(r.selling_points && r.selling_points.length){
      body.appendChild(drawSection('卖点拆解', listBlock(r.selling_points)));
    }
    if(r.recommended_types && r.recommended_types.length){
      body.appendChild(drawSection('推荐开发类型', listBlock(r.recommended_types)));
    }
    body.appendChild(drawSection('人群与场景', infoTable([
      ['目标人群', r.target_audience||'—'],
      ['穿着场景', r.scenario||'—'],
      ['生命周期', r.life_cycle||'—']
    ])));
    body.appendChild(drawSection('面料 / 版型 / 工艺', infoTable([
      ['面料', r.fabric||'—'],
      ['版型', r.fit||'—'],
      ['印花工艺', r.print_process||'—'],
      ['设计点', r.design||'—']
    ])));
    body.appendChild(drawSection('价格锚点', esc(r.price_anchor||('参考竞品定价 '+r.price+'，可在同价带做面料升级或设计差异化切入'))));
    body.appendChild(drawSection('原创开发建议', esc('可借鉴「'+(r.theme||r.design||'')+'」风格开发原创款，突出 '+(r.theme_cat||r.type||'')+' 属性，定价参考 '+(r.price||'—')+'；以几何化、抽象化规避直接复制，保留风格记忆点。')));
    body.appendChild(drawSection('上架时机', esc('结合当前趋势 '+(r.trend||'—')+'，建议小批量测款后追单；若关联节日/赛事，按倒计时窗口前置备货。')));
    body.appendChild(drawSection('合规等级', noticeBlock(r.compliance_level||'常规原创设计，避免政治/宗教敏感即可','d-warn')));
    body.appendChild(tagify(mergeTags(regionTags(p,c), hashtagsFrom(r.product+' '+r.cn+' '+r.design+' '+r.theme))));
    body.appendChild(sourceSection('爆款数据来自工作台自有信息渠道与平台榜单整理。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showIpDetail(it){
    var body=el('div');
    var meta=[{text:(it.type||'')},{text:(it.site||'')},{type:'countdown',text:(it.signal||'')}];
    body.appendChild(drawHeader(it.keyword,meta));

    body.appendChild(drawSection('热点信息', infoTable([
      ['关键词', it.keyword||'—'],
      ['类型', it.type||'—'],
      ['来源站点', it.site||'—'],
      ['热度信号', it.signal||'—'],
      ['信息渠道', (String(it.source_url||'').trim()
          ? '<a href="'+esc(String(it.source_url).trim())+'" target="_blank" rel="noopener">'+
            esc(String(it.source||'').trim()||String(it.source_url).replace(/^https?:\/\//,'').split('/')[0])+'</a>'
          : (it.source||'—'))],
      ['生命周期', it.lifecycle||'—']
    ])));

    body.appendChild(drawSection('目标人群', esc(it.audience||'18-35 岁泰马年轻潮流消费者。')));
    body.appendChild(drawSection('印花T恤机会', esc(it.tshirt_opportunity||('围绕「'+esc(it.keyword||'')+'」设计原创印花T恤，用抽象化/梗文案规避版权。'))));

    if(it.design_elements && it.design_elements.length){
      body.appendChild(drawSection('推荐图案元素', listBlock(it.design_elements)));
    }
    body.appendChild(drawSection('配色方案', esc(it.color_palette||'黑/白/灰安全底色 + 1 个趋势强调色。')));
    body.appendChild(drawSection('推荐文案/标题', '<div class="d-copy">'+esc(it.copywriting||'')+'</div>'));
    body.appendChild(drawSection('面料与版型', esc(it.fabric_suggestion||'180-200gsm 纯棉或棉混纺，兼顾挺括与透气。')));
    body.appendChild(drawSection('定价与窗口', esc(it.pricing_window||'泰马通用价带，小批量测款后追单。')));

    if(it.action_plan && it.action_plan.length){
      body.appendChild(drawSection('上架行动清单', listBlock(it.action_plan)));
    }
    body.appendChild(drawSection('合规注意', noticeBlock(it.compliance||'避免直接使用影视/品牌/国旗/政治人物肖像；采用抽象化、风格化再设计。','d-warn')));

    var ipRegionTags = regionTags(null, it.site).concat(['印花T恤','Tee','Tshirt','原创印花','POD']);
    body.appendChild(tagify(mergeTags(ipRegionTags, hashtagsFrom((it.hashtags||[]).join(' ')+' '+(it.keyword||'')))));
    var ipSrcNote='IP/关键词热点来自工作台自有信息渠道实时检索；印花建议由本店主营方向（原创印花T恤）派生。建议核查站点：'+(it.source_sites||'Google News')+'。';
    body.appendChild(sourceSection(ipSrcNote, it.source_url, '🔗 点击查证消息来源'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showGlobalDetail(it,cat){
    var body=el('div');
    var meta=[{text:cat},{text:'热度 '+(it.heat||'')},{text:'关联度 '+(it.relevance||'')}];
    body.appendChild(drawHeader(it.content,meta));
    body.appendChild(drawSection('趋势信息', infoTable([
      ['内容', it.content||'—'],
      ['来源', it.source||'—'],
      ['热度', it.heat||'—'],
      ['关联度', it.relevance||'—']
    ])));
    body.appendChild(drawSection('内容解读', esc(it.content||'')));
    body.appendChild(drawSection('区域文化适配', esc('面向 🇹🇭 泰国 / 🇲🇾 马来西亚市场时，需考虑宗教与审美差异：伊斯兰市场避免暴露与争议符号，佛教市场避免神像复制；用本地化色彩与文字增强共鸣。')));
    body.appendChild(drawSection('印花机会', esc(it.opportunity||'—')));
    if(it.link){
      body.appendChild(drawSection('在线查询',
        '<a class="gt-link" href="'+esc(it.link)+'" target="_blank" rel="noopener">🔍 打开查询链接（新标签页）↗</a>'
        +'<div class="gt-link-url">'+esc(it.link)+'</div>'));
    }
    body.appendChild(tagify(mergeTags(regionTags(cat==='TikTok'?'TikTok':cat==='YouTube'?'YouTube':cat==='Netflix'?'Netflix':'', ''), hashtagsFrom(it.content+' '+it.opportunity))));
    body.appendChild(sourceSection('来源：'+(it.source||'—')));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showLiveDetail(it){
    var body=el('div');
    var meta=[{text:it.platform},{text:it.region},{type:'countdown',text:'实时源'}];
    body.appendChild(drawHeader(it.name,meta));
    body.appendChild(drawSection('数据源信息', infoTable([
      ['平台', it.platform||'—'],
      ['覆盖地区', it.region||regionFromDataKey(it)||'—'],
      ['说明', it.note||it.desc||'—'],
      ['数据类型', it.url_kind==='json'?'JSON 接口':(it.url_kind==='rss'?'RSS 订阅源':'网页')]
    ])));
    body.appendChild(drawSection('怎么用', listBlock([
      '点下面的「打开官网/栏目页」到源头看全文；卡住打不开时，再试「原始数据源」或备用入口。',
      '把源头的关键词/条目复制到本看板「实时热搜」「IP/关键词热点」或「搜索词排名」做交叉验证。',
      '发现可印花转化的趋势后，24h 内出稿、48h 内上架测款。'
    ])));
    body.appendChild(tagify(mergeTags(regionTags(it.platform, it.region), [it.platform, it.region, 'trending', '实时热点'])));
    var linkBox=el('div');
    var readUrl=String(it.read_url||it.url||'');
    var feedUrl=String(it.feed_url||'');
    if(readUrl){
      var a=el('a','d-link', it.proxy_hint?'🔗 打开官网/栏目页（需代理/登录）':'🔗 打开官网/栏目页');
      a.href=readUrl; a.target='_blank'; a.rel='noopener';
      linkBox.appendChild(a);
      if(it.proxy_hint) linkBox.appendChild(el('p','d-warn','⚠️ 该官网在中国大陆需代理/登录才能打开；下方提供可直连的 Google 趋势替代入口。'));
    }
    // 机器接口单独列出，避免用户把人读页面和程序接口混为一谈
    if(feedUrl && feedUrl!==readUrl){
      var fb=el('a','d-link d-link-feed','⚙️ 原始数据源（RSS/JSON，程序读取）');
      fb.href=feedUrl; fb.target='_blank'; fb.rel='noopener';
      linkBox.appendChild(fb);
      linkBox.appendChild(el('p','d-muted','这是给程序读的地址，直接打开会看到 XML/JSON 源码，不是页面损坏。'));
    }
    if(it.alt_urls && it.alt_urls.length){
      linkBox.appendChild(el('p','d-muted','🌐 国内可看替代（Google 趋势，无需代理）：'));
      it.alt_urls.forEach(function(u){
        var b=el('a','d-link', u.name); b.href=u.url; b.target='_blank'; b.rel='noopener'; linkBox.appendChild(b);
      });
    }
    body.appendChild(drawSection('来源 / 跳转',linkBox));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showFxDetail(k){
    var title=k==='TH'?'🇹🇭 泰国汇率与天气':'🇲🇾 马来西亚汇率与天气';
    var fx=fxNorm(k), city=null;
    weatherNorm().forEach(function(c){ if(!city && c.key===k) city=c; });
    var body=el('div');
    var meta=[{text:k==='TH'?'🇹🇭 泰国':'🇲🇾 马来西亚'},{type:'date',text:fx.usd?('1 USD ≈ '+fx.usd+' '+fx.code):'汇率待采集'}];
    body.appendChild(drawHeader(title,meta));
    body.appendChild(drawSection('完整数据', infoTable([
      ['1 美元', fx.usd!=null?(fx.usd+' '+fx.code):'—'],
      ['1 '+fx.code, fx.perCny!=null?(fx.perCny+' 元'):'—'],
      ['1 元', fx.cnyPer!=null?(fx.cnyPer+' '+fx.code):'—'],
      ['汇率更新时间', fxYmd(fx.updated)||'—'],
      ['天气', weatherLine(city)||'—'],
      ['穿搭建议', (city&&city.advice)||'—']
    ])));
    if(fx.usd!=null){
      body.appendChild(drawSection('成本与利润影响（分析）', esc('以 1 USD≈'+fx.usd+' '+fx.code+'、1 '+fx.code+'≈'+(fx.perCny!=null?fx.perCny:'?')+' 元 计，人民币采购成本换算后需重新核算售价与毛利；若平台新增技术支持费/佣金上调，建议在 '+fx.code+' 定价中前置消化，避免利润被汇率与费率双向挤压。')));
    }
    if(fx.warn) body.appendChild(drawSection('成本预警', noticeBlock(fx.warn,'d-warn')));
    if(city && city.alert) body.appendChild(drawSection('天气预警', noticeBlock(city.alert,'d-danger')));
    body.appendChild(drawSection('选品与物流提示', listBlock([
      '雨季/高温：速干、透气、防晒类面料需求上升。',
      '极端天气：物流时效波动，建议提前发货或改空运。',
      '汇率波动期：锁定结算币种，减少汇兑损失。'
    ])));
    body.appendChild(sourceSection('汇率与天气数据来自工作台自有信息渠道实时检索。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }
  // ---------- KPI ----------
  function countSearch(){var n=0;var s=D.search_rankings||{};Object.keys(s).forEach(function(p){Object.keys(s[p]||{}).forEach(function(c){n+= ((s[p][c]||[]).length);});});return n;}
  function countBest(){var n=0;var s=D.bestsellers||{};Object.keys(s).forEach(function(p){Object.keys(s[p]||{}).forEach(function(c){n+= ((s[p][c]||[]).length);});});return n;}
  function countHot(){var g=(D.hot_searches||{}).geo||{};return ((g.TH||[]).length)+((g.MY||[]).length);}
  function countNews(){var n=0;(((D.news_feed||{}).groups)||[]).forEach(function(g){ n+=((g&&g.items)||[]).length; });return n;}
  function renderKPI(){
    var row=$('#kpi-row'); if(!row) return;
    row.innerHTML='';
    var _stSearch=sectionStats(D.search_rankings);
    var _stBest=sectionStats(D.bestsellers);
    var _nfGroups=((D.news_feed||{}).groups||[]).length;
    var items=[
      {label:'数据日期',value:D.meta?D.meta.date:'-',sub:D.meta?(D.meta.weekday||''):''},
      {label:'竞品监控',value:(D.competitors||[]).length,sub:'三平台×两国'},
      {label:'搜索词',value:countSearch(),sub:statsSub(_stSearch,'子表')},
      {label:'平台爆款',value:countBest(),sub:statsSub(_stBest,'组')},
      {label:'IP热点',value:(D.ip_hotspots||[]).length,sub:'实时关键词'},
      {label:'动漫电影',value:(D.anime_film||[]).length,sub:'2026热点IP'},
      {label:'实时热搜',value:countHot(),sub:countHot()?'泰/马两榜':'本次未取到'},
      {label:'行业新闻',value:countNews(),sub:_nfGroups?('泰/马/全球 '+_nfGroups+' 组'):'本次未取到'}
    ];
    items.forEach(function(it){
      var c=el('div','kpi');
      c.appendChild(el('div','kpi-label',it.label));
      c.appendChild(el('div','kpi-value',String(it.value)));
      c.appendChild(el('div','kpi-sub',it.sub));
      row.appendChild(c);
    });
  }

  // ---------- 节假日倒计时动态化 ----------
  // 原数据 days_left 是按报表日期冻结的快照，会随查看时间漂移。
  // 改为按「当前真实日期 + 下一次出现」动态计算，确保永远准确；
  // 支持 MD 里全部真实写法（2026/12/13、2027/2月、11月-次年1月、6–8月、8/31 & 9/16、农历正月初九（2026/2/25））。
  function holidayCands(s){
    if(!s) return [];
    var t=String(s), out=[], x, re;
    // 1) 年月日：2026/12/13
    re=/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/g; out=[];
    while((x=re.exec(t))!==null){ if(+x[2]>=1&&+x[2]<=12&&+x[3]>=1&&+x[3]<=31) out.push({m:+x[2],d:+x[3],y:+x[1]}); }
    if(out.length) return out;
    // 2) 年月（无日）：2027/2月
    re=/(\d{4})[-\/.](\d{1,2})\s*月?/g; out=[];
    while((x=re.exec(t))!==null){ if(+x[2]>=1&&+x[2]<=12) out.push({m:+x[2],d:1,y:+x[1]}); }
    if(out.length) return out;
    // 3) 月份区间：11月-次年1月 / 6–8月
    re=/(\d{1,2})\s*月?\s*[-–—]\s*(?:次年)?\s*(\d{1,2})\s*月/g; out=[];
    while((x=re.exec(t))!==null){ if(+x[1]>=1&&+x[1]<=12) out.push({m:+x[1],d:1,y:null}); }
    if(out.length) return out;
    // 4) 月/日：8/13-19 / 9/20-26 / 8/31 & 9/16
    re=/(\d{1,2})\s*[\/\-]\s*(\d{1,2})/g; out=[];
    while((x=re.exec(t))!==null){ if(+x[1]>=1&&+x[1]<=12&&+x[2]>=1&&+x[2]<=31) out.push({m:+x[1],d:+x[2],y:null}); }
    if(out.length) return out;
    // 5) 纯月份：11月
    re=/(\d{1,2})\s*月/g; out=[];
    while((x=re.exec(t))!==null){ if(+x[1]>=1&&+x[1]<=12) out.push({m:+x[1],d:1,y:null}); }
    return out;
  }
  // 与后端 extract_dashboard_data.py:_pick_occurrence 同口径（2026-10-16 修复）：
  // 近 45 天内已过 → 保留负值（甘特图本就剔除 days_left<-3）；否则取最近一次未来出现。
  var PAST_KEEP=45;
  function recomputeHolidays(){
    var list=(D.holidays||[]); if(!list.length) return;
    var today=new Date();
    var tY=today.getFullYear();
    var base=new Date(tY,today.getMonth(),today.getDate()); base.setHours(0,0,0,0);
    list.forEach(function(h){
      var cs=holidayCands(h.date);
      if(!cs.length) return;   // 解析失败（如“常态化”）则保留后端算好的 days_left
      var cands=[];
      cs.forEach(function(c){
        // 2026-10-16 修复：带 4 位年份的写法必须原样尊重，不得扩成 ±1 年。
        // 原写法 [c.y-1,c.y,c.y+1] 会把快照写明的「2027/10/28 屠妖节（2027 年度）」
        // 拉回 2026-10-28（+12 天），与条目标题自相矛盾 —— 且前端在浏览器里
        // 会覆盖后端刚算好的 +377，等于后端白修。与 extract_dashboard_data.py
        // :recompute_date_fields 保持同口径（那里同样只对无年份写法做滚动）。
        // 无年份的按去年/今年/明年滚动，且必须含「去年」，
        // 否则 45 天内刚过的一次性节点会被错误滚到明年。
        var ys=c.y?[c.y]:[tY-1,tY,tY+1];
        ys.forEach(function(yy){
          var cand=new Date(yy,c.m-1,c.d); cand.setHours(0,0,0,0);
          cands.push(cand);
        });
      });
      if(!cands.length) return;
      var fut=[],past=[];
      cands.forEach(function(c){
        (Math.round((c-base)/86400000)>=0?fut:past).push(c);
      });
      // 2026-10-16 二次修复（与后端 _pick_occurrence 同口径）：
      // 复合日期格（如「09/20-26（长舟）/ 10/26（流光船）」）可能同时含
      // 「刚过去的子事件」与「更近的在途子事件」；旧逻辑无条件取 max(past)
      // 会显示 -26，把同格内仅剩 10 天的流光船节掩盖成已过。
      // 故当两者都落在可展示窗口内时按「就近」取（并列时保留刚过的那次）。
      // 单日期格不受影响：其未来候选通常是明年（+335 等），远大于刚过的那次。
      var recentPast=null, nearFut=null;
      if(past.length){
        var mp=Math.max.apply(null,past);
        if(Math.round((base-mp)/86400000)<=PAST_KEEP) recentPast=mp;
      }
      if(fut.length) nearFut=Math.min.apply(null,fut);
      var pick;
      if(recentPast && nearFut){
        pick=(Math.round((base-recentPast)/86400000)<=Math.round((nearFut-base)/86400000))
             ? recentPast : nearFut;
      } else if(recentPast){
        pick=recentPast;
      } else if(nearFut){
        pick=nearFut;
      } else {
        pick=Math.max.apply(null,cands);
      }
      h.days_left=Math.round((pick-base)/86400000);
    });
  }

  // ---------- 倒计时甘特 ----------
  // 站点判定：优先用后端写入的 site 字段，其次按地点/名称文本兜底
  function holSite(h){
    var s=String(h.site||'');
    if(s==='th'||s==='malay'||s==='global') return s;
    var t=String(h.location||'')+' '+String(h.name||'');
    if(/泰国|🇹🇭/.test(t)) return 'th';
    if(/马来|🇲🇾|🇲🇷/.test(t)) return 'malay';
    return 'global';
  }
  var SITE_META={
    th:{name:'泰国',flag:'🇹🇭',color:'#ff5c5c'},
    malay:{name:'马来西亚',flag:'🇲🇷',color:'#3fb6a8'},
    global:{name:'全球',flag:'🌐',color:'#5b9bff'}
  };
  // 节点标签清洗：去括号/英文/emoji，压成单行，避免 y 轴换行把图挤爆
  function holLabel(h){
    var s=String(h.name||'');
    s=s.replace(/【[^】]*】/g,'').replace(/（[^）]*）/g,'').replace(/\([^)]*\)/g,'');
    s=s.replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{2BFF}\u{FE0F}\u{20E3}]/gu,'');
    // 中英混排时去掉英文冗余（如「玛希敦日 Mahidol Day」→「玛希敦日」）
    if(/[\u4e00-\u9fff]/.test(s)) s=s.replace(/[A-Za-z][A-Za-z0-9&.\s]*/g,' ');
    s=s.replace(/\s*[/·]\s*$/,'').replace(/\s+/g,' ').trim();
    if(s.length>18) s=s.slice(0,18)+'…';
    // 站点旗标：地点同时含泰国+马来时并列显示
    var t=String(h.location||'')+' '+String(h.name||'');
    var isTH=/泰国|🇹🇭/.test(t), isMY=/马来|🇲🇾|🇲🇷/.test(t);
    var site=holSite(h);
    var flag=(site==='th')?(isMY?'🇹🇭🇲🇷':'🇹🇭'):((site==='malay')?(isTH?'🇹🇭🇲🇷':'🇲🇷'):'🌐');
    return flag+' '+s;
  }
  // 时间窗：数据里有 horizon/window 字段就以数据为准，没有则退回默认 180 天，
  // 并在图例里标明「这是窗口、不是全部节点」，避免把窗口天数误当成全量。
  function readHorizon(){
    var m=D.meta||{}, keys=['horizon','horizon_days','window_days','window','days'];
    for(var i=0;i<keys.length;i++){
      var v=m[keys[i]];
      if(v==null && m.time_heat) v=m.time_heat[keys[i]];
      var n=parseInt(v,10);
      if(!isNaN(n) && n>0) return {days:n, fromData:true};
    }
    return {days:180, fromData:false};
  }
  var _cdHorizon=readHorizon();
  var CD_STATE={site:'all',horizon:_cdHorizon.days,horizonFromData:_cdHorizon.fromData};
  var _cdChart=null;
  function renderCountdown(){
    var box=$('#countdown-chart'); if(!box) return;
    // 工具栏：站点筛选 + 时间窗
    var fbox=$('#cd-filters');
    if(fbox && !fbox.dataset.built){
      fbox.dataset.built='1';
      var mk=function(txt,on,fn){
        var b=el('button','fbtn'+(on?' on':''),txt);
        b.onclick=function(){
          fn();
          [].forEach.call(fbox.querySelectorAll('.fbtn'),function(x){x.classList.remove('on');});
          b.classList.add('on');
          renderCountdown();
        };
        return b;
      };
      fbox.appendChild(el('span','flabel','站点'));
      [['all','全部'],['th','🇹🇭 泰国'],['malay','🇲🇷 马来西亚'],['global','🌐 全球']].forEach(function(s){
        fbox.appendChild(mk(s[1],CD_STATE.site===s[0],function(){CD_STATE.site=s[0];}));
      });
      fbox.appendChild(el('span','flabel','时间窗'));
      var _winOpts=[[30,'30天'],[90,'90天'],[180,'半年'],[730,'两年']];
      if(!_winOpts.some(function(o){return String(CD_STATE.horizon)===String(o[0]);})){
        _winOpts.push([CD_STATE.horizon, CD_STATE.horizon+'天']);
        _winOpts.sort(function(a,b){return a[0]-b[0];});
      }
      _winOpts.forEach(function(s){
        fbox.appendChild(mk(s[1],String(CD_STATE.horizon)===String(s[0]),function(){CD_STATE.horizon=parseInt(s[0],10); CD_STATE.horizonFromData=false;}));
      });
    }
    var all=(D.holidays||[]).filter(function(h){
      if(h.days_left==null) return false;
      if(h.days_left<-3 || h.days_left>CD_STATE.horizon) return false;
      if(CD_STATE.site!=='all' && holSite(h)!==CD_STATE.site) return false;
      return true;
    });
    all.sort(function(a,b){return a.days_left-b.days_left;});
    if(!all.length){ box.innerHTML='<div style="padding:18px;color:#8fa3b8">当前筛选条件下暂无节点</div>'; return; }
    var names=all.map(holLabel);
    var vals=all.map(function(h){return h.days_left;});
    // 柱色 = 站点（泰国红 / 马来青 / 全球蓝），已过期灰
    var colors=all.map(function(h){return h.days_left<0?'#5b6b7e':SITE_META[holSite(h)].color;});
    box.style.height=Math.max(320, all.length*30+64)+'px';
    if(_cdChart){ try{_cdChart.dispose();}catch(e){} _cdChart=null; }
    _cdChart=echarts.init(box);
    _cdChart.setOption({
      backgroundColor:'transparent',
      grid:{left:198,right:78,top:10,bottom:26},
      tooltip:{trigger:'axis',axisPointer:{type:'shadow'},formatter:function(p){
        var h=all[p[0].dataIndex]; if(!h) return '';
        var sm=SITE_META[holSite(h)];
        var t='<b>'+esc(h.name||'')+'</b><br/>'+sm.flag+' '+sm.name;
        if(h.location) t+=' · '+esc(h.location);
        t+='<br/>⏳ 距今天数：'+(h.days_left>0?(h.days_left+' 天'):(h.days_left===0?'今天':'已过'+Math.abs(h.days_left)+'天'));
        if(h.date) t+='<br/>📆 '+esc(h.date);
        if(h.category) t+='<br/>🏷 '+esc(h.category);
        if(h.audience) t+='<br/>🎯 受众：'+esc(h.audience);
        if(h.opportunity) t+='<br/>👕 '+esc(h.opportunity);
        t+='<br/><span style="opacity:.65">点击查看详情 / 主题词 / 搜索词</span>';
        return t;}},
      xAxis:{type:'value',name:'距今天数',nameTextStyle:{color:'#8fa3b8'},axisLabel:{color:'#8fa3b8'},splitLine:{lineStyle:{color:'rgba(36,55,72,.6)'}}},
      yAxis:{type:'category',data:names,inverse:true,axisTick:{show:false},
        axisLabel:{color:'#cdd9e5',fontSize:11,width:190,overflow:'truncate',align:'right'},
        axisLine:{lineStyle:{color:'#243748'}}},
      series:[{type:'bar',barWidth:'58%',
        data:vals.map(function(v,i){return {value:v,itemStyle:{color:colors[i],borderRadius:[0,4,4,0]}};}),
        label:{show:true,position:'right',formatter:'{c}天',color:'#cdd9e5',fontSize:11}}]
    });
    _cdChart.on('click',function(p){ var h=all[p.dataIndex]; if(h) showHolidayDetail(h); });
    // 图例 + 计数
    var lbox=$('#cd-legend');
    if(lbox){
      var cnt={th:0,malay:0,global:0};
      all.forEach(function(h){cnt[holSite(h)]++;});
      lbox.innerHTML=['th','malay','global'].map(function(k){
        return '<span><i class="cd-dot" style="background:'+SITE_META[k].color+'"></i>'+SITE_META[k].flag+' '+SITE_META[k].name+' <b>'+cnt[k]+'</b></span>';
      }).join('')+'<span style="margin-left:auto;opacity:.75">共 <b>'+all.length+'</b> 个节点 · 当前时间窗 '+CD_STATE.horizon+' 天'+(CD_STATE.horizonFromData?'（取自数据）':'（窗口内节点，非全部）')+' · 点击柱条查看详情与搜索词</span>';
    }
    // 可读清单：canvas 里的文字选不中、Ctrl+F 搜不到，补一份近 45 天的可复制表格
    var lb=$('#cd-list');
    if(lb){
      var near=all.filter(function(h){return h.days_left>=-3 && h.days_left<=45;}).slice(0, 20);
      if(!near.length){
        lb.innerHTML='';
      }else{
        var rows=near.map(function(h){
          var sm=SITE_META[holSite(h)];
          var dl=h.days_left>0?(h.days_left+' 天'):(h.days_left===0?'今天':'已过 '+Math.abs(h.days_left)+' 天');
          // location 常常自带「TH 泰国 · 」前缀，站点已单独占一列，这里剥掉避免重复
          var loc=String(h.location||'').replace(/^(TH|MR|MY|🌐)\s*/,'')
            .replace(new RegExp('^'+String(sm.name).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*[·]?\\s*'),'');
          return '<tr data-idx="'+all.indexOf(h)+'" style="cursor:pointer">'
            +'<td>'+sm.flag+' '+esc(sm.name)+'</td>'
            +'<td>'+esc(h.name||'')+(loc?'<span style="opacity:.6"> · '+esc(loc)+'</span>':'')+'</td>'
            +'<td>'+esc(h.date||'')+'</td>'
            +'<td style="white-space:nowrap">'+dl+'</td>'
            +'<td>'+esc(String(h.opportunity||'').slice(0,60))+'</td>'
            +'</tr>';
        }).join('');
        lb.innerHTML='<div style="margin:16px 0 8px;font-size:13px;color:#8fa3b8">📋 近 45 天节点清单（可复制 · 点击行看详情）</div>'
          +'<div class="table-wrap"><table class="grid-table"><thead><tr>'
          +'<th>站点</th><th>节点</th><th>日期</th><th>距今天数</th><th>选品机会</th>'
          +'</tr></thead><tbody>'+rows+'</tbody></table></div>';
        Array.prototype.forEach.call(lb.querySelectorAll('tbody tr'),function(tr){
          tr.addEventListener('click',function(){
            var h=all[parseInt(tr.getAttribute('data-idx'),10)];
            if(h) showHolidayDetail(h);
          });
        });
      }
    }
  }

  // ---------- 通用筛选器 ----------
  function buildFilters(box,platforms,countries,cb){
    box.innerHTML='';
    var pSel=el('select','fselect');platforms.forEach(function(p){pSel.appendChild(new Option(p,p));});
    var cSel=el('select','fselect');countries.forEach(function(c){cSel.appendChild(new Option(c,c));});
    pSel.onchange=cSel.onchange=function(){cb(pSel.value,cSel.value);};
    box.appendChild(el('span','flabel','平台'));box.appendChild(pSel);
    box.appendChild(el('span','flabel','国家'));box.appendChild(cSel);
    return {p:pSel,c:cSel};
  }

  // ---------- 全局「时间 × 热度」筛选 ----------
  // 数据层（extract_dashboard_data.py + time_heat.py）已给每条动态数据打标：
  //   t / t_src / win(day|week|month|older) / stale / h / h_raw / h_kind / f / hl
  // 前端只做「视图收窄」：不重新取数、不改内容；无标签的条目（节假日历等附录型）始终保留。
  var THF={win:'all',heat:'all'};
  var _TH_RAW=null, _TH_KEYS=null;
  var THF_WIN=[['all','全部'],['day','当日'],['week','本周'],['month','本月']];
  var THF_HEAT=[['all','全部'],['hot','🔥🔥🔥 高热'],['mid','🔥🔥 中热+'],['native','有原生指标']];
  var TH_WIN_ORDER={day:0,week:1,month:2,older:3};
  var TH_WIN_LIMIT={day:0,week:1,month:2};
  var TH_WIN_CN={all:'全部',day:'当日',week:'本周',month:'本月'};
  var TH_HEAT_CN={all:'全部',hot:'🔥🔥🔥 高热',mid:'🔥🔥 中热+',native:'有原生指标'};

  function thHasTag(it){
    return it && typeof it==='object' && !(it instanceof Array) && ('win' in it || 't' in it);
  }
  function thPass(it){
    if(!thHasTag(it)) return true;
    if(THF.win!=='all'){
      var o=TH_WIN_ORDER[it.win], lim=TH_WIN_LIMIT[THF.win];
      if(o==null || o>lim) return false;
    }
    if(THF.heat==='hot'){ if(!(it.f>=3 || it.hl==='high')) return false; }
    else if(THF.heat==='mid'){ if(!(it.f>=2 || it.hl==='high' || it.hl==='mid')) return false; }
    else if(THF.heat==='native'){ if(it.h==null) return false; }
    return true;
  }
  function thWalk(node){
    if(node instanceof Array){
      var out=[];
      for(var i=0;i<node.length;i++){
        var x=node[i];
        if(thHasTag(x)){ if(thPass(x)) out.push(x); }
        else out.push(thWalk(x));
      }
      return out;
    }
    if(node && typeof node==='object'){
      for(var k in node){ if(Object.prototype.hasOwnProperty.call(node,k)) node[k]=thWalk(node[k]); }
    }
    return node;
  }
  function thScanFound(n,d){
    if(d>4) return false;
    if(n instanceof Array){
      for(var i=0;i<n.length;i++){ if(thHasTag(n[i])) return true; if(thScanFound(n[i],d+1)) return true; }
      return false;
    }
    if(n && typeof n==='object'){
      for(var k in n){ if(Object.prototype.hasOwnProperty.call(n,k) && thScanFound(n[k],d+1)) return true; }
    }
    return false;
  }
  function thFilterableKeys(){
    // 只重建「确实含打标条目」的键 —— 避免把 fetchLiveFxWeather 刚刷新的
    // fx / weather 等易变键回退成旧快照值。
    var ks=[];
    Object.keys(_TH_RAW).forEach(function(k){
      if(k==='meta') return;
      if(thScanFound(_TH_RAW[k],0)) ks.push(k);
    });
    return ks;
  }
  function thRebuild(){
    if(!_TH_RAW) return;
    if(!_TH_KEYS) _TH_KEYS=thFilterableKeys();
    _TH_KEYS.forEach(function(k){
      D[k]=thWalk(JSON.parse(JSON.stringify(_TH_RAW[k])));
    });
  }
  function thRenderBar(){
    var wb=$('#thf-win'), hb=$('#thf-heat');
    if(!wb||!hb) return;
    function fill(box,arr,cur,key){
      box.innerHTML='';
      arr.forEach(function(p){
        var b=el('button','fbtn'+(cur===p[0]?' on':''),p[1]);
        b.onclick=function(){ THF[key]=p[0]; applyTimeHeat(); };
        box.appendChild(b);
      });
    }
    fill(wb,THF_WIN,THF.win,'win');
    fill(hb,THF_HEAT,THF.heat,'heat');
  }
  function applyTimeHeat(){
    if(!_TH_RAW) _TH_RAW=JSON.parse(JSON.stringify(D));   // 首次快照，此后都从快照重建
    thRebuild();
    renderAll();                                          // 复用启动用的完整渲染序列
    thRenderBar();
    var n=$('#thf-note');
    if(n){
      var th=(D.meta&&D.meta.time_heat)||{}, bw=th.by_window||{};
      n.innerHTML='当前：<b>'+(TH_WIN_CN[THF.win]||'全部')+' × '+(TH_HEAT_CN[THF.heat]||'全部')+'</b>'
        +'<br>数据层：打标 '+(th.scanned_items||0)+' 条 · 当日 '+(bw.day||0)+' / 本周 '+(bw.week||0)
        +' / 本月 '+(bw.month||0)+' · 原生指标 '+(th.with_native_metric||0)
        +' · 老信号 '+(th.stale_signals||0)+' · 超窗剔除 '+(th.dropped_out_of_window||0)
        +'（无热度 / 时间标注的条目始终保留）';
    }
  }

  // ---------- 网络节日 & 平台造节 ----------
  function renderOnlineFestivals(){
    var wrap=$('#onlinefest-body'); if(!wrap) return;
    var items=(D.online_festivals||[]);
    if(!items.length){ wrap.innerHTML='<div style="padding:18px;color:#8fa3b8">暂无网络节日数据</div>'; return; }
    var order={'🔴':0,'🟠':1,'🟡':2,'🟢':3};
    items=items.slice().sort(function(a,b){
      var ra=order[(a.priority||'').charAt(0)], rb=order[(b.priority||'').charAt(0)];
      var va=(ra==null?9:ra), vb=(rb==null?9:rb);
      if(va!==vb) return va-vb;
      return String(a.name||'').localeCompare(String(b.name||''));
    });
    var groups={}, keys=[];
    items.forEach(function(it){
      var p=(it.priority||'').trim()||'🟢 P3';
      if(!groups[p]){groups[p]=[];keys.push(p);}
      groups[p].push(it);
    });
    var h='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 10px;font-size:12px;color:#8fa3b8">'
      +'<span>🔴 P0 ≤45天 · 最高力度</span><span>🟠 P1 46–90天</span>'
      +'<span>🟡 P2 91天+ · 周期性</span><span>🟢 P3 长尾文化节</span></div>';
    keys.forEach(function(p){
      h+='<h3 style="font-size:13px;color:#7dd3fc;margin:14px 0 8px">'+esc(p)
        +' <span style="color:#8fa3b8;font-weight:400">（'+groups[p].length+' 条）</span></h3>';
      h+='<div class="table-wrap"><table class="grid-table"><thead><tr>'
        +'<th>网络节日</th><th>时间</th><th>站点</th><th>主题词</th><th>精准搜索词（单一主题类目）</th><th>热度</th>'
        +'</tr></thead><tbody>';
      groups[p].forEach(function(it){
        h+='<tr><td><strong>'+esc(it.name)+'</strong></td>'
          +'<td>'+esc(it.date)+'</td>'
          +'<td>'+esc(it.sites)+'</td>'
          +'<td>'+esc(it.theme)+'</td>'
          +'<td><code style="font-size:12px;color:#7dd3fc">'+esc(it.query)+'</code></td>'
          +'<td>'+esc(it.heat)+'</td></tr>';
      });
      h+='</tbody></table></div>';
    });
    h+='<div style="font-size:12px;color:#8fa3b8;margin-top:10px">共 '+items.length+' 条 · 搜索词按「单一主题类目」给出，可直接复制使用；热度为平台侧定性信号。</div>';
    wrap.innerHTML=h;
  }

  // 子筛选器选中态：时间/热度筛选会触发整体重渲染，若不复用会在每次点击后
  // 把用户在「平台 / 国家 / 类目 / 站点」上的选择重置回默认值（看起来像 bug）。
  var SUB_SEL={
    competitors:{p:'Lazada',c:'🇹🇭 泰国'},
    search:{p:'Lazada',c:'🇹🇭 泰国'},
    best:{p:'Lazada',c:'🇹🇭 泰国',type:'focus'},
    anime:{type:'全部',site:'全部'},
    ent:{type:'全部',site:'全部'}
  };

  // ---------- 竞品 ----------
  function renderCompetitors(){
    var wrap=$('#competitor-body'); if(!wrap) return;
    wrap.innerHTML='';
    var container=el('div','table-wrap'); wrap.appendChild(container);
    var platforms=['Lazada','Shopee','TikTok']; var countries=['🇹🇭 泰国','🇲🇾 马来西亚'];
    var sel=buildFilters($('#comp-filters'),platforms,countries,function(p,c){
      SUB_SEL.competitors.p=p; SUB_SEL.competitors.c=c; drawComp(p,c);
    });
    sel.p.value=SUB_SEL.competitors.p; sel.c.value=SUB_SEL.competitors.c;
    drawComp(SUB_SEL.competitors.p,SUB_SEL.competitors.c);
    function drawComp(p,c){
      var rows=(D.competitors||[]).filter(function(r){return r.platform===p&&r.country===c;});
      container.innerHTML='';
      var t=el('table','grid-table');
      t.innerHTML='<thead><tr><th>排名</th><th>竞品商品</th><th>价格</th><th>月销</th><th>趋势</th><th>主题</th><th>链接</th></tr></thead>';
      var tb=el('tbody');
      rows.forEach(function(r){
        var tr=el('tr');
        var link=r.link?('<a href="'+esc(r.link)+'" target="_blank" onclick="event.stopPropagation()">查看</a>'):'';
        tr.innerHTML='<td>'+(r.rank||'')+'</td><td>'+esc(r.product)+'</td><td>'+esc(r.price)+'</td><td>'+esc(r.monthly_sales)+'</td><td>'+esc(r.trend)+'</td><td>'+esc(r.theme)+'</td><td>'+link+'</td>';
        tr.onclick=function(){showCompetitorDetail(r);};
        tb.appendChild(tr);
      });
      t.appendChild(tb); container.appendChild(t);
      if(!rows.length) container.appendChild(el('div','','该筛选下暂无数据'));
      var _ccn=channelNote(rows,{fallback:'Lazada / Shopee / TikTok 站内类目与检索页 + FastMoss / Accio 第三方榜单（月销类字段需卖家中心登录态，通道受限时如实标注沿用读数日）'});
      if(_ccn) container.appendChild(_ccn);
    }
  }

  // ---------- 搜索词 ----------
  function renderSearch(){
    var wrap=$('#search-body'); if(!wrap) return;
    wrap.innerHTML='';
    var container=el('div','table-wrap'); wrap.appendChild(container);
    var platforms=['Lazada','Shopee','TikTok']; var countries=['🇹🇭 泰国','🇲🇾 马来西亚'];
    var sel=buildFilters($('#search-filters'),platforms,countries,function(p,c){
      SUB_SEL.search.p=p; SUB_SEL.search.c=c; drawSearch(p,c);
    });
    sel.p.value=SUB_SEL.search.p; sel.c.value=SUB_SEL.search.c;
    drawSearch(SUB_SEL.search.p,SUB_SEL.search.c);
    function drawSearch(p,c){
      var rows=(((D.search_rankings||{})[p]||{})[c])||[];
      container.innerHTML='';
      var t=el('table','grid-table');
      t.innerHTML='<thead><tr><th>排名</th><th>搜索词</th><th>中文</th><th>趋势</th><th>热度信号</th></tr></thead>';
      var tb=el('tbody');
      rows.forEach(function(r){
        var tr=el('tr');
        tr.innerHTML='<td>'+(r.rank||'')+'</td><td>'+esc(r.word)+'</td><td>'+esc(r.cn)+'</td><td>'+esc(r.trend)+'</td><td>'+esc(r.heat||'')+'</td>';
        tr.onclick=function(){showSearchDetail(r,p,c);};
        tb.appendChild(tr);
      });
      t.appendChild(tb); container.appendChild(t);
      if(!rows.length) container.appendChild(el('div','','该筛选下暂无数据'));
      var _scn=channelNote(rows,{fallback:'Shopee / Lazada / TikTok 站内关键词榜（需卖家中心登录态；采集通道受限时沿用最近快照，不编造排名）'});
      if(_scn) container.appendChild(_scn);
    }
  }

  // ---------- 平台爆款 ----------
  function renderBestsellers(){
    var wrap=$('#best-body'); if(!wrap) return;
    wrap.innerHTML='';
    var container=el('div','table-wrap'); wrap.appendChild(container);
    var platforms=['Lazada','Shopee','TikTok']; var countries=['🇹🇭 泰国','🇲🇾 马来西亚'];
    var TSHIRT_TYPES=['基础款','基础','基础/时尚','印花/趣味','图案','功能','功能/节日','运动/速干','Oversized','运动','速干/凉感','偶像','卡通','动漫','IP','大码','趣味','原创','影视','韩流','应援','套装'];
    function isTshirtType(t){ return TSHIRT_TYPES.indexOf((t||'').trim())>=0; }
    function isTshirt(r){ return (r.category==='tshirt') || isTshirtType(r.type); }
    var tshirtOnly=(SUB_SEL.best.type!=='all');

    var sel=buildFilters($('#best-filters'),platforms,countries,function(p,c){
      SUB_SEL.best.p=p; SUB_SEL.best.c=c; drawBest(p,c);
    });
    var filterBox=$('#best-filters');
    var typeSel=el('select','fselect');
    typeSel.appendChild(new Option('印花T恤聚焦','focus'));
    typeSel.appendChild(new Option('全部类目(含相邻服饰)','all'));
    typeSel.value=SUB_SEL.best.type;
    typeSel.onchange=function(){ tshirtOnly=(typeSel.value==='focus'); SUB_SEL.best.type=typeSel.value; drawBest(sel.p.value, sel.c.value); };
    filterBox.appendChild(el('span','flabel','类目'));
    filterBox.appendChild(typeSel);
    sel.p.value=SUB_SEL.best.p; sel.c.value=SUB_SEL.best.c;

    drawBest(SUB_SEL.best.p,SUB_SEL.best.c);
    function drawBest(p,c){
      var allRows=(((D.bestsellers||{})[p]||{})[c])||[];
      var rows=tshirtOnly?allRows.filter(isTshirt):allRows;
      container.innerHTML='';
      var t=el('table','grid-table');
      t.innerHTML='<thead><tr><th>排名</th><th>爆款T恤</th><th>精确主题</th><th>中文</th><th>价格区间</th><th>销量/热度</th><th>类型</th><th>印花设计点</th><th>趋势</th><th>来源</th></tr></thead>';
      var tb=el('tbody');
      rows.forEach(function(r){
        var tr=el('tr');
        var catBadge = (r.category==='adjacent') ? ' <span class="badge-adj">相邻</span>' : '';
        var typeShow = r.type_show || r.type || '';
        var themeCell = r.theme ? esc(r.theme) : '—';
        // 信息获取渠道：优先真实链接，其次渠道名（不再留空）
        var _lk=String(r.link||'').trim();
        var _srcName=String(r.source||'').trim();
        var srcCell='—';
        if(_lk){
          var _h=_lk.replace(/^https?:\/\//,'').split('/')[0].replace(/^www\./,'');
          srcCell='<a class="src-link" href="'+esc(_lk)+'" target="_blank" rel="noopener" title="'+esc(_srcName||_lk)+'" onclick="event.stopPropagation()">🔗 '+esc(_h)+'</a>';
        } else if(_srcName){
          srcCell='<span class="src-name">'+esc(_srcName)+'</span>';
        }
        tr.innerHTML='<td>'+(r.rank||'')+'</td><td>'+esc(r.product)+catBadge+'</td><td class="best-theme">'+themeCell+'</td><td>'+esc(r.cn)+'</td><td>'+esc(r.price)+'</td><td>'+esc(r.signal)+'</td><td>'+esc(typeShow)+'</td><td>'+esc(r.design)+'</td><td>'+esc(r.trend)+'</td><td>'+srcCell+'</td>';
        tr.onclick=function(){showBestDetail(r,p,c);};
        tb.appendChild(tr);
      });
      t.appendChild(tb); container.appendChild(t);
      if(!rows.length){
        var emptyMsg=tshirtOnly?'该筛选下暂无印花T恤数据；可切换到「全部类目(含相邻服饰)」查看其他类目。':'该筛选下暂无数据';
        container.appendChild(el('div','',emptyMsg));
      }
      if(tshirtOnly){
        var adj = allRows.filter(function(r){return r.category==='adjacent';}).length;
        if(adj) container.appendChild(el('div','badj-note','该市场另有 '+adj+' 个相邻服饰类目（连衣裙/穆斯林传统/衬衫等）已隐藏，切换到「全部类目」可见——其印花方向对T恤选品有借鉴价值。'));
      }
      var _bcn=channelNote(rows);
      if(_bcn) container.appendChild(_bcn);
    }
  }

  // ---------- IP热点 ----------
  function renderIpHotspots(){
    var body=$('#ip-body'); if(!body) return;
    body.innerHTML='';
    (D.ip_hotspots||[]).forEach(function(it){
      var tag=el('div','tag');
      tag.innerHTML=esc(it.keyword)+'<span class="t-type">'+(it.type||'')+'</span><span class="t-site">'+(it.site||'')+'</span><span class="t-signal">'+(it.signal||'')+'</span>'+
        '<span class="t-opp">'+(it.tshirt_opportunity?esc(it.tshirt_opportunity).substring(0,55)+'…':'')+'</span>';
      tag.onclick=function(){showIpDetail(it);};
      body.appendChild(tag);
    });
    if(!(D.ip_hotspots||[]).length) body.appendChild(el('div','','暂无数据'));
    var _icn=channelNote(D.ip_hotspots,{fallback:'Google Trends 多市场热搜（官方、免登录）/ Shopee·Lazada·TikTok 站内类目与检索页 / FastMoss·Accio 第三方榜单 / 官方社媒与新闻站（逐条来源见条目详情）'});
    if(_icn) body.appendChild(_icn);
  }

  // ---------- 动漫卡通电影 ----------
  function showAnimeDetail(it){
    var body=el('div');
    var meta=[{text:(it.type||'')},{text:(it.category||'')},{text:(it.site||'')},{type:'countdown',text:(it.hotness||'')}];
    body.appendChild(drawHeader(it.cn||it.title,meta));
    body.appendChild(drawSection('基础信息', infoTable([
      ['作品（原文）', it.title||'—'],
      ['中文', it.cn||'—'],
      ['类型', it.type||'—'],
      ['分类', it.category||'—'],
      ['热度地区', it.site||'—'],
      ['上映 / 档期', it.release||'—'],
      ['热度信号', it.hotness||'—'],
      ['市场表现', it.metric||'—'],
      ['目标人群', it.audience||'—']
    ])));
    body.appendChild(drawSection('T恤印花机会', esc(it.tshirt_opportunity||'围绕「'+(it.cn||it.title)+'」做原创风格化印花，规避版权。')));
    if(it.design_elements && it.design_elements.length){
      body.appendChild(drawSection('推荐图案元素', listBlock(it.design_elements)));
    }
    body.appendChild(drawSection('配色方案', esc(it.color_palette||'黑/白/灰安全底色 + 1 个趋势强调色。')));
    if(it.copywriting) body.appendChild(drawSection('推荐文案/标题', '<div class="d-copy">'+esc(it.copywriting)+'</div>'));
    body.appendChild(drawSection('面料与版型', esc(it.fabric_suggestion||'180-200gsm 纯棉或棉混纺，兼顾挺括与透气。')));
    body.appendChild(drawSection('定价与窗口', esc(it.pricing_window||'泰马通用价带，小批量测款后追单。')));
    body.appendChild(drawSection('合规注意', noticeBlock(it.compliance||'避免直接使用影视/动漫角色肖像与官方 LOGO；采用抽象化、风格化再设计。','d-warn')));
    var animeRegionTags = regionTags(null, it.site).concat(['印花T恤','Tee','动漫','卡通','电影','原创印花']);
    body.appendChild(tagify(mergeTags(animeRegionTags, hashtagsFrom((it.hashtags||[]).join(' ')+' '+(it.cn||'')+' '+(it.title||'')))));
    var animeSrcNote='动漫卡通电影数据来自公开票房/榜单（WebSearch 采集，2026 真实热点）。印花建议由本店主营方向（原创印花T恤）派生。建议核查站点：'+(it.source_sites||'公开票房榜')+'。';
    body.appendChild(sourceSection(animeSrcNote, it.source, '🔗 点击查证来源'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }
  function renderAnimeFilm(){
    var body=$('#anime-body');
    if(!body) return;
    body.innerHTML='';
    var types=['全部','动漫','卡通','电影'];
    // 站点芯片同样改为**数据驱动**：数据里没有的站点不再出现（历史：种子无泰国条目，
    // 但界面固定给了 🇹🇭 泰国 → 点进去必然空白，2026-10-23 修）
    function animeBucket(ds){
      ds=String(ds||'');
      if(/泰国|🇹🇭|\bTH\b/i.test(ds)) return 'TH';
      if(/马来|🇲🇷|\bMY\b/i.test(ds)) return 'MY';
      return 'GLOBAL';
    }
    var SITE_DEF=[['TH','🇹🇭 泰国'],['MY','🇲🇷 马来西亚'],['GLOBAL','🌐 全球']];
    var _ps={}; (D.anime_film||[]).forEach(function(it){ _ps[animeBucket(it.site)]=1; });
    var sites=['全部'].concat(SITE_DEF.filter(function(p){ return _ps[p[0]]; }).map(function(p){ return p[1]; }));
    var st=SUB_SEL.anime;
    if(types.indexOf(st.type)<0) st.type='全部';      // 数据变更后旧选择可能失效
    if(sites.indexOf(st.site)<0) st.site='全部';
    var fb=el('div','ent-filters'); fb.style.marginBottom='10px';
    var tRow=el('div','ent-chip-row'); tRow.appendChild(el('span','ent-chip-label','类型：'));
    var typeBtns=[];
    var _tc={}; (D.anime_film||[]).forEach(function(it){ _tc[it.type]=(_tc[it.type]||0)+1; });
    var _sc={}; (D.anime_film||[]).forEach(function(it){ var b=animeBucket(it.site); _sc[b]=(_sc[b]||0)+1; });
    types.forEach(function(t){
      var lab=(t==='全部')?('全部 '+(D.anime_film||[]).length):(t+' '+(_tc[t]||0));
      var b=el('button','ent-chip'+(st.type===t?' active':''), lab);
      b.onclick=function(){ st.type=t; draw(); }; tRow.appendChild(b); typeBtns.push([b,t]);
    });
    var sRow=el('div','ent-chip-row'); sRow.appendChild(el('span','ent-chip-label','站点：'));
    var siteBtns=[];
    sites.forEach(function(s){
      var cnt=(s==='全部')?(D.anime_film||[]).length:(_sc[({'🇹🇭 泰国':'TH','🇲🇷 马来西亚':'MY','🌐 全球':'GLOBAL'})[s]]||0);
      var b=el('button','ent-chip'+(st.site===s?' active':''), (s==='全部'?s:(s+' '+cnt)));
      b.onclick=function(){ st.site=s; draw(); }; sRow.appendChild(b); siteBtns.push([b,s]);
    });
    fb.appendChild(tRow); fb.appendChild(sRow);
    body.appendChild(fb);
    var list=el('div','anime-grid'); body.appendChild(list);
    function matchSite(itemSite, sel){
      if(sel==='全部') return true;
      var b=animeBucket(itemSite);
      if(sel==='🌐 全球') return b==='GLOBAL';
      if(sel.indexOf('泰国')>=0) return b==='TH';
      if(sel.indexOf('马来西亚')>=0) return b==='MY';
      return true;
    }
    function draw(){
      typeBtns.forEach(function(p){ p[0].className='ent-chip'+(st.type===p[1]?' active':''); });
      siteBtns.forEach(function(p){ p[0].className='ent-chip'+(st.site===p[1]?' active':''); });
      list.innerHTML='';
      var rows=(D.anime_film||[]).filter(function(it){
        return (st.type==='全部'||it.type===st.type) && matchSite(it.site, st.site);
      });
      if(!rows.length){ list.appendChild(el('div','ent-empty','该筛选下暂无动漫卡通电影热点')); return; }
      rows.forEach(function(it){
        var card=el('div','anime-card');
        var typeCls='at-'+(it.type||'其他');
        var inner='<div class="anime-top"><span class="anime-type '+typeCls+'">'+esc(it.type)+'</span><span class="anime-site">'+esc(it.site||'')+'</span><span class="anime-hot">'+esc(it.hotness||'')+'</span></div>'+
          '<div class="anime-cn">'+esc(it.cn||it.title)+'</div>'+
          '<div class="anime-title">'+esc(it.title||'')+'</div>'+
          (it.metric?'<div class="anime-metric">📊 '+esc(it.metric)+'</div>':'')+
          (it.tshirt_opportunity?'<div class="anime-opp">👕 '+esc(it.tshirt_opportunity.substring(0,60)+(it.tshirt_opportunity.length>60?'…':''))+'</div>':'');
        card.innerHTML=inner;
        card.onclick=function(){showAnimeDetail(it);};
        list.appendChild(card);
      });
    }
    draw();
    var _acn=channelNote(D.anime_film);
    if(_acn) body.appendChild(_acn);
  }

  // ---------- 全球趋势 ----------
  function renderGlobal(){
    var body=$('#global-body'); if(!body) return;
    body.innerHTML='';
    var cats=[{k:'TikTok',label:'📱 TikTok.com 国际趋势'},{k:'YouTube',label:'▶️ YouTube 全球趋势'},{k:'Netflix',label:'🎬 Netflix / 流媒体'},{k:'Shopping',label:'🛒 购物平台爆款'}];
    cats.forEach(function(cat){
      var arr=(D.global_trends||{})[cat.k]||[];
      var box=el('div','gt-cat'); box.appendChild(el('h3',null,cat.label));
      var linkLabel={TikTok:'查 TikTok 话题',YouTube:'搜 YouTube 视频',Netflix:'搜 Netflix 片源',Shopping:'查平台商品'}[cat.k]||'在线查询';
      arr.forEach(function(it){
        var item=el('div','gt-item');
        var linkHtml=it.link?('<a class="gt-link" href="'+esc(it.link)+'" target="_blank" rel="noopener" title="'+esc(it.link)+'">🔍 '+linkLabel+' ↗</a>'):'';
        item.innerHTML='<div class="gt-content">'+esc(it.content)+'</div><div class="gt-meta">来源: '+esc(it.source)+' · 热度: '+esc(it.heat)+' · 关联度: '+esc(it.relevance)+'</div><div class="gt-opp">印花机会: '+esc(it.opportunity)+'</div>'+linkHtml;
        item.onclick=function(){showGlobalDetail(it,cat.label);};
        var _a=item.querySelector('.gt-link');
        if(_a){ _a.addEventListener('click',function(ev){ ev.stopPropagation(); }); }
        box.appendChild(item);
      });
      body.appendChild(box);
    });
    var _gtAll=[];
    ['TikTok','YouTube','Netflix','Shopping'].forEach(function(k){ _gtAll=_gtAll.concat((D.global_trends||{})[k]||[]); });
    var _gtcn=channelNote(_gtAll,{fallback:'TikTok Creative Center / YouTube Trending / Netflix Top10 / Google Trends（官方热榜）'});
    if(_gtcn) body.appendChild(_gtcn);
  }

  // ---------- 娱乐档期前瞻（演唱会/演出/电影/新歌）----------
  // 「来源」字段多为裸域名/站点名（如 uoblive.asia、songkick）+（日期）后缀，无协议头。
  // 旧逻辑只认 ^https?:// → 一律降级为不可点击 <span>，表现为「看不了来源」。此处统一补全。
  function entSrcLabel(s){
    return String(s==null?'':s).replace(/\s*[（(]\s*\d{4}-\d{2}-\d{2}\s*[)）]\s*$/,'').trim();
  }
  function entSrcDate(s){
    var m=String(s==null?'':s).match(/[（(]\s*(\d{4}-\d{2}-\d{2})\s*[)）]\s*$/);
    return m?m[1]:'';
  }
  function entSrcUrl(s){
    var raw=String(s==null?'':s).trim();
    if(!raw) return '';
    if(/^https?:\/\//i.test(raw)) return raw;                 // 已是完整 URL
    var t=entSrcLabel(raw);
    if(/^[A-Za-z0-9][A-Za-z0-9.\-]*\.[A-Za-z]{2,}(?:[/?#].*)?$/.test(t)) return 'https://'+t;  // 裸域名
    if(t) return 'https://www.bing.com/search?q='+encodeURIComponent(t+' official');            // 站点名 → 搜索兜底
    return '';
  }
  function renderEntertainment(){
    var body=$('#entertainment-body');
    if(!body) return;
    body.innerHTML='';
    function parseDate(s){
      if(!s) return null;
      s=String(s);
      // ① 带年份：2026-09-22 / 2026/9/22
      var m=/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/.exec(s);
      if(m){ var d0=new Date(+m[1], +m[2]-1, +m[3]); return isNaN(d0.getTime())?null:d0; }
      // ② 无年份 M/D（含区间 M/D–D、M/D–M/D 取起始日）：9/22、9/26–29、10/6–7、9/17 在映
      m=/(?:^|[^\d])(\d{1,2})\s*[\/\-.]\s*(\d{1,2})(?:\s*[–—~至\-]\s*\d{1,2})?/.exec(s);
      if(!m) return null;
      var mo=+m[1], da=+m[2];
      if(mo<1||mo>12||da<1||da>31) return null;
      var y=today.getFullYear();
      var d=new Date(y, mo-1, da);
      if(isNaN(d.getTime())) return null;
      // 跨年推断：已过去超过 45 天 → 视为次年（与 _fix_days.py 同规则）
      if((d-today)/86400000 < -45) d=new Date(y+1, mo-1, da);
      return d;
    }
    var today=new Date(); today.setHours(0,0,0,0);
    var all=(D.entertainment||[]).map(function(e){
      var lbl=String(e.date==null?'':e.date).trim();
      return {date:lbl, d:parseDate(lbl), type:(e.type||'').trim(), name:(e.name||'').trim(), location:(e.location||'').trim(), site:(e.site||'').trim(), opportunity:(e.opportunity||'').trim(), source:(e.source||'').trim(), source_url:(e.source_url||'').trim()};
    });
    var upcoming=all.filter(function(e){ return e.d && e.d>=today; });
    var undated=all.filter(function(e){ return !e.d; });   // 长期/待定/在映：不再静默丢弃
    var expired=all.length-upcoming.length-undated.length;
    upcoming.sort(function(a,b){ return a.d-b.d; });

    // ---------- 类型归一：把 30+ 种细分类型收敛为 8 个可筛选大类 ----------
    // 卡片上的类型徽标仍显示原始细分类型（如「电影（Netflix）」），此处只影响筛选芯片。
    // 历史缺陷（2026-10-23 修）：芯片曾按「全部数据」生成、列表却只渲染未来档期，
    // 导致只剩过期条目的 12 个芯片点进去必然空白；且 4 个「电影（平台）」类碎片各 1-8 条，筛选价值低。
    var TYPE_GROUPS=[
      ['音乐节', /音乐节/],
      ['演唱会', /演唱会|巡演/],
      ['电影',   /电影|影视/],
      ['剧集',   /剧集|首播|上线|纪录片/],
      ['新歌',   /新歌/],
      ['专辑',   /专辑/],
      ['节庆',   /节庆|假期|万圣活动|节$/],
      ['大促',   /大促|购物节点/]
    ];
    function entCat(t){
      t=String(t||'');
      for(var i=0;i<TYPE_GROUPS.length;i++){ if(TYPE_GROUPS[i][1].test(t)) return TYPE_GROUPS[i][0]; }
      return '其他';
    }
    // 芯片**只按可见集合（未来 + 长期/待定）**统计，保证每个芯片点进去必有内容，并显示条数
    var present={};
    upcoming.concat(undated).forEach(function(e){ var k=entCat(e.type); present[k]=(present[k]||0)+1; });
    var types=['全部'].concat(Object.keys(present).sort(function(a,b){ return present[b]-present[a]; }));
    var sites=['全部','🇹🇭 泰国','🇲🇷 马来西亚','🌐 全球/线上'];
    var st=SUB_SEL.ent;
    if(types.indexOf(st.type)<0) st.type='全部';      // 数据变更后旧选择可能失效
    if(sites.indexOf(st.site)<0) st.site='全部';
    // 站点分桶：数据里存在「泰国站 / 马来西亚站 / 全球」以及 Netflix、线下、Lazada、国会 等平台值，
    // 旧逻辑按 emoji 前缀匹配（'🇹🇭 泰国' vs '泰国站'）→ 三个站点芯片全部匹配失败。改为语义分桶。
    function entSiteBucket(ds){
      ds=String(ds||'');
      if(/泰国|🇹🇭|\bTH\b/i.test(ds)) return 'TH';
      if(/马来|🇲🇷|\bMY\b/i.test(ds)) return 'MY';
      return 'GLOBAL';   // 全球 / Netflix / 线下 / 三平台 / 国会 / 新闻 / Lazada → 归入「全球·线上」
    }
    function siteMatch(ds, chip){
      if(chip==='全部') return true;
      if(chip.indexOf('泰国')>=0) return entSiteBucket(ds)==='TH';
      if(chip.indexOf('马来')>=0) return entSiteBucket(ds)==='MY';
      return entSiteBucket(ds)==='GLOBAL';
    }

    var head=el('div','ent-head');
    head.appendChild(el('div','ent-count', (upcoming.length?('未来约 3 个月共 '+upcoming.length+' 场已确认档期'):'近期暂无已确认档期') + (undated.length?(' · 另有 '+undated.length+' 条长期/待定'):'') + (expired>0?(' · 已自动隐藏 '+expired+' 场过期场次'):'')));
    body.appendChild(head);

    var fb=el('div','ent-filters');
    var tRow=el('div','ent-chip-row');
    tRow.appendChild(el('span','ent-chip-label','类型：'));
    types.forEach(function(t){
      var lab=(t==='全部')?('全部 '+(upcoming.length+undated.length)):(t+' '+present[t]);
      var b=el('button','ent-chip'+(st.type===t?' active':''), lab);
      b.onclick=function(){ st.type=t; draw(); };
      tRow.appendChild(b);
    });
    var sRow=el('div','ent-chip-row');
    sRow.appendChild(el('span','ent-chip-label','站点：'));
    sites.forEach(function(s){
      var b=el('button','ent-chip'+(st.site===s?' active':''), s);
      b.onclick=function(){ st.site=s; draw(); };
      sRow.appendChild(b);
    });
    fb.appendChild(tRow); fb.appendChild(sRow);
    body.appendChild(fb);

    var list=el('div','ent-list');
    body.appendChild(list);

    function siteLabel(ds){
      ds=String(ds||'');
      if(ds.indexOf('泰国')>=0) return '🇹🇭 泰国';
      if(ds.indexOf('马来')>=0) return '🇲🇷 马来西亚';
      if(ds.indexOf('全球')>=0||ds.indexOf('🌐')>=0) return '🌐 全球';
      return ds;
    }
    function draw(){
      list.innerHTML='';
      function pass(e){ return (st.type==='全部'||entCat(e.type)===st.type) && siteMatch(e.site, st.site); }
      var rows=upcoming.filter(pass);
      var und=undated.filter(pass);
      if(!rows.length && !und.length){ list.appendChild(el('div','ent-empty','该筛选下暂无档期')); return; }
      function card(e){
        var c=el('div','ent-card');
        var days=e.d?Math.round((e.d-today)/86400000):null;
        var dateStr=(e.date||'').trim();
        if(/^\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}/.test(dateStr)) dateStr=dateStr.slice(5).replace('-','/');
        var leftTxt=(days===null)?'待定':(days===0?'今天':('剩 '+days+' 天'));
        var leftCls=(days===null)?'':(days<=7?' ent-urgent':(days<=30?' ent-soon':''));
        var tbdStyle=(days===null)?' style="border-left-color:#5b6b7e;opacity:.9"':'';
        var typeCls='type-'+(e.type||'其他');
        var srcHtml='';
        if(e.source){
          var _su=(e.source_url||'').trim()||entSrcUrl(e.source);
          var _sl=entSrcLabel(e.source)||e.source;
          var _sd=entSrcDate(e.source);
          if(_su){
            srcHtml='<a class="ent-src" href="'+esc(_su)+'" target="_blank" rel="noopener" title="'+esc(_su)+'">🔗 '+esc(_sl)+'</a>'+
                    (_sd?'<span class="ent-src-d">（'+esc(_sd)+'）</span>':'');
          } else {
            srcHtml='<span class="ent-src">📎 '+esc(e.source)+'</span>';
          }
        }
        c.innerHTML='<div class="ent-left-wrap'+leftCls+'"'+tbdStyle+'><div class="ent-day">'+esc(dateStr||'—')+'</div><div class="ent-left">'+esc(leftTxt)+'</div></div>'+
          '<div class="ent-main">'+
            '<div class="ent-top"><span class="ent-type '+typeCls+'">'+esc(e.type)+'</span><span class="ent-site">'+esc(siteLabel(e.site))+'</span></div>'+
            '<div class="ent-name">'+esc(e.name)+'</div>'+
            (e.location?'<div class="ent-loc">📍 '+esc(e.location)+'</div>':'')+
            (e.opportunity?'<div class="ent-opp">印花机会：'+esc(e.opportunity)+'</div>':'')+
            srcHtml+
          '</div>';
        list.appendChild(c);
      }
      rows.forEach(card);
      if(und.length){
        var sh=el('div','ent-subhead','长期 / 档期待定（'+und.length+'）');
        sh.style.cssText='margin:16px 0 8px;padding:7px 12px;font-size:13px;font-weight:600;color:#9fb3c8;border-left:3px solid #4a6b8a;background:rgba(74,107,138,.14);border-radius:4px';
        list.appendChild(sh);
        und.forEach(card);
      }
    }
    draw();
    var _ecn=channelNote(all);
    if(_ecn) body.appendChild(_ecn);
  }

  // ---------- 实时热点源 ----------
  // 机器接口（RSS / JSON / API）不能当卡片主链接：直接打开只会看到源码，用户会以为页面坏了
  // 判据只看「路径是否指向机器端点」，不能看查询参数：
  // Google Trends 的人读页本身就是 …/trendingsearches/daily?geo=TH，用 ?geo= 判会把合法栏目页误杀。
  var MACHINE_URL_RE=/\/feed\/?(\?|$)|\/rss(\/|$|\?)|trending\/rss|\.xml(\?|$)|api\.open-meteo\.com|open\.er-api\.com/i;
  function isMachineUrl(u){ return MACHINE_URL_RE.test(String(u||'')); }
  function renderLiveSources(){
    var body=$('#live-body'); if(!body) return;
    body.innerHTML='';
    var ICONS={'TikTok':'🎵','YouTube':'▶️','Netflix':'🎬','Google':'🔍','论坛报':'📰','X':'🐦','Instagram':'📸','Threads':'🧵','Facebook':'📘','WhatsApp':'💬','Telegram':'✈️','ThaiPBS':'📺','BangkokPost':'📰','LINE':'💚','Pantip':'🗣️','Thaiger':'🐯'};
    var sources=(D.live_sources||[]);
    if($('#live-src-count')) $('#live-src-count').textContent=String(sources.length);
    sources.forEach(function(it){
      it=it||{};
      // 主链接优先人读页面 read_url，旧数据缺失该字段时退回 url
      var url=String(it.read_url||it.url||'');
      var machine=isMachineUrl(url);
      var card=(url&&!machine)?el('a','live-card'):el('div','live-card');
      if(url&&!machine){
        card.href=url; card.target='_blank'; card.rel='noopener';
        card.title='打开「'+text(it.name)+'」人读页面（新标签）';
      }
      var icon=ICONS[it.platform]||'📡';
      var _meta=[it.platform,it.region].filter(function(x){return !!x;}).join(' · ');
      var _desc=it.note||it.desc||'';
      card.innerHTML='<div class="live-icon">'+icon+'</div><div class="live-name">'+esc(it.name)+'</div><div class="live-meta">'+esc(_meta)+'</div><div class="live-desc">'+esc(_desc)+'</div>';
      // 抽屉入口：右下角小按钮，阻止冒泡以免触发卡片链接
      var more=el('button','live-more','详情');
      more.type='button';
      more.title='查看渠道详情与备用入口';
      more.setAttribute('aria-label','查看渠道详情');
      more.onclick=function(ev){ if(ev){ev.preventDefault(); ev.stopPropagation();} showLiveDetail(it); };
      card.appendChild(more);
      if(!url||machine){ card.onclick=function(ev){ if(ev) ev.preventDefault(); showLiveDetail(it); }; }
      body.appendChild(card);
    });
    if(!sources.length) body.appendChild(el('div','','暂无实时热点源'));
  }

  // ---------- 实时热搜（Google Trends 多市场）----------
  function renderLiveTrends(){
    var body=$('#livetrends-body'); if(!body) return;
    body.innerHTML='';
    if(D.meta && D.meta.live_trends_updated) $('#livetrends-at').textContent=D.meta.live_trends_updated;
    var GEOS=[['TH','🇹🇭 泰国'],['MY','🇲🇾 马来西亚'],['SG','🇸🇬 新加坡'],['ID','🇮🇩 印尼'],['PH','🇵🇭 菲律宾']];
    var wrap=el('div','lt-wrap');
    var tabs=el('div','lt-tabs');
    var listWrap=el('div','lt-list');
    var active='TH';

    function drawList(geo){
      listWrap.innerHTML='';
      var list=(D.live_trends&&D.live_trends[geo])||[];
      if(!list.length){ listWrap.appendChild(el('div','lt-empty','暂无数据 / 抓取失败')); return; }
      list.forEach(function(it,idx){
        var item=el('div','lt-item');
        var rank=el('span','lt-rank',String(idx+1));
        var main=el('div','lt-main');
        var t=el('div','lt-title',esc(it.title));
        main.appendChild(t);
        if(it.traffic) main.appendChild(el('span','lt-traffic','🔥 '+esc(it.traffic)));
        if(it.news && it.news.length){
          var ns=el('div','lt-news');
          it.news.slice(0,2).forEach(function(n){
            var _u=n.url||it.link||'';
            if(_u){
              var a=el('a','lt-news-item',esc(n.title));
              a.href=_u; a.target='_blank'; a.rel='noopener';
              ns.appendChild(a);
            }else{
              // 源站链接已失效（4xx 实测）时只留标题，不造一个点了没反应的空链接
              ns.appendChild(el('span','lt-news-item lt-news-plain',esc(n.title)));
            }
          });
          main.appendChild(ns);
        }
        item.appendChild(rank);
        item.appendChild(main);
        if(it.link){
          item.onclick=function(){ window.open(it.link,'_blank'); };
          item.style.cursor='pointer';
        }
        listWrap.appendChild(item);
      });
    }

    GEOS.forEach(function(pair){
      var b=el('button','lt-tab',pair[1]);
      if(pair[0]===active) b.className+=' active';
      b.onclick=function(){
        active=pair[0];
        Array.prototype.forEach.call(tabs.querySelectorAll('.lt-tab'),function(x){x.classList.remove('active');});
        b.classList.add('active');
        drawList(active);
      };
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(listWrap);
    body.appendChild(wrap);
    drawList(active);

    var any=GEOS.some(function(p){ return ((D.live_trends&&D.live_trends[p[0]])||[]).length>0; });
    if(!any) body.appendChild(el('div','','实时热搜抓取失败，请稍后自动刷新或检查网络'));
  }

  // ---------- 实时热搜（hot_searches：泰国 / 马来西亚两列 + 品类 tab）----------
  function clipText(s,n){
    var t=String(s==null?'':s);
    return t.length>n?(t.slice(0,n)+'…'):t;
  }
  var HS_CATS=[['all','全部'],['ent','娱乐音乐'],['sport','体育赛事'],['social','民生时政'],
               ['shop','消费购物'],['game','游戏动漫'],['style','美妆穿搭'],['other','其他']];
  var HS_CAT_LABEL={ent:'娱乐音乐',sport:'体育赛事',social:'民生时政',shop:'消费购物',
                    game:'游戏动漫',style:'美妆穿搭',other:'其他'};
  var HS_GEOS=[['TH','🇹🇭 泰国 TH','泰国'],['MY','🇲🇾 马来西亚 MY','马来西亚'],
               ['SG','🇸🇬 新加坡 SG','新加坡'],['ID','🇮🇩 印尼 ID','印尼'],['PH','🇵🇭 菲律宾 PH','菲律宾']];
  var HS_GEO_LABEL={TH:'泰国',MY:'马来西亚',SG:'新加坡',ID:'印尼',PH:'菲律宾'};
  var _hsGeo='TH', _hsCat='all';

  function hsCatOf(it){
    var c=(it&&it.category)?String(it.category).toLowerCase():'';
    return HS_CAT_LABEL[c]?c:'';
  }
  // 地址栏：#hotsearch、#hotsearch=<geo>、#hotsearch=<geo>-<cat>，且兼容旧的纯品类写法 #hotsearch=ent → TH+ent
  function hsReadHash(){
    var m=/^#hotsearch(?:=([a-z\-]+))?$/i.exec(String(location.hash||''));
    if(!m) return null;
    var out={geo:null,cat:null};
    String(m[1]||'').toLowerCase().split('-').forEach(function(p){
      if(!p) return;
      var gk=p.toUpperCase(); // hash 里写小写（#hotsearch=my-ent），映射表键是大写
      if(HS_GEO_LABEL[gk]) out.geo=gk;
      else if(p==='all') out.cat='all';
      else if(HS_CAT_LABEL[p]) out.cat=p;
    });
    if(!out.geo) out.geo='TH';
    if(!out.cat) out.cat='all';
    return out;
  }
  function hsSyncHash(geo,cat){
    var g=String(geo||'TH').toLowerCase();
    var h=(cat&&cat!=='all')?('#hotsearch='+g+'-'+cat):('#hotsearch='+g);
    try{
      if(window.history&&window.history.replaceState) window.history.replaceState(null,'',h);
    }catch(e){}
  }
  function renderHotSearch(){
    var body=$('#hotsearch-body'); if(!body) return;
    body.innerHTML='';
    var hs=D.hot_searches||{};
    var geo=hs.geo||{};
    var lists={};
    HS_GEOS.forEach(function(p){ lists[p[0]]=(geo[p[0]]||[]); });
    if($('#hotsearch-src')) $('#hotsearch-src').textContent=String(hs.source||'Google Trends 每日热搜（泰 / 马 / 新 / 印尼 / 菲）');
    if($('#hotsearch-at')) $('#hotsearch-at').textContent=fxYmd((hs.fetched_at||{}).TH||(hs.fetched_at||{}).MY)||'—';
    var total=0; HS_GEOS.forEach(function(p){ total+=lists[p[0]].length; });
    if(!total){
      body.appendChild(el('div','hs-empty','本次未取到热门搜索，原因见「数据渠道」板块'));
      return;
    }
    var fromHash=hsReadHash();
    if(fromHash){ _hsGeo=fromHash.geo||_hsGeo; _hsCat=fromHash.cat||'all'; }
    // 地址栏手动改 #hotsearch=xxx 时不重载页面，只发 hashchange —— 跟上它，分页才不会和地址栏脱节
    if(!renderHotSearch._hashBound){
      renderHotSearch._hashBound=true;
      window.addEventListener('hashchange',function(){
        var h=hsReadHash();
        if(h&&(h.geo!==_hsGeo||h.cat!==_hsCat)){ _hsGeo=h.geo; _hsCat=h.cat; renderHotSearch(); }
      });
    }
    var countOf=function(g,cat){
      var rows=lists[g]||[];
      return cat==='all'?rows.length:rows.filter(function(it){ return hsCatOf(it)===cat; }).length;
    };
    if(!(lists[_hsGeo]||[]).length){
      var firstGeo=null;
      HS_GEOS.forEach(function(p){ if(!firstGeo&&(lists[p[0]]||[]).length) firstGeo=p[0]; });
      _hsGeo=firstGeo||'TH';
    }
    if(_hsCat!=='all' && !countOf(_hsGeo,_hsCat)) _hsCat='all';
    // 只在地址栏本来就带热搜深链时回写；否则不要用 #hotsearch=th 覆盖用户带进来的 #sec-xxx 锚点
    if(fromHash) hsSyncHash(_hsGeo,_hsCat);

    // 第一层：市场
    var geoBox=el('div','hs-tabs hs-geo-tabs');
    HS_GEOS.forEach(function(p){
      var k=p[0], n=(lists[k]||[]).length;
      var b=el('button','hs-tab hs-geo-tab',esc(p[1])+'<b>'+n+'</b>');
      b.type='button';
      if(!n){ b.className+=' is-empty'; b.disabled=true; }
      if(k===_hsGeo) b.className+=' active';
      b.onclick=function(){
        if(!n||k===_hsGeo) return;
        _hsGeo=k;
        if(_hsCat!=='all' && !countOf(k,_hsCat)) _hsCat='all';
        hsSyncHash(k,_hsCat); renderHotSearch();
      };
      geoBox.appendChild(b);
    });
    body.appendChild(geoBox);

    // 第二层：品类（计数只算当前市场）
    // 数据源没给品类标注时（Google Trends RSS 只有关键词+热度），
    // 这一排 tab 全是 0 且禁用，看着像坏了 —— 干脆整排不渲染。
    var _hasCat=false;
    HS_CATS.forEach(function(pair){ if(pair[0]!=='all'&&countOf(_hsGeo,pair[0])) _hasCat=true; });
    var tabs=el('div','hs-tabs hs-cat-tabs');
    if(_hasCat) HS_CATS.forEach(function(pair){
      var key=pair[0], n=countOf(_hsGeo,key);
      var b=el('button','hs-tab',esc(pair[1])+'<b>'+n+'</b>');
      b.type='button';
      if(!n){ b.className+=' is-empty'; b.disabled=true; }
      if(key===_hsCat) b.className+=' active';
      b.onclick=function(){
        if(!n||key===_hsCat) return;
        _hsCat=key; hsSyncHash(_hsGeo,key); renderHotSearch();
      };
      tabs.appendChild(b);
    });
    if(_hasCat) body.appendChild(tabs);

    // 列表：只渲染当前市场一列
    var curGeo=null;
    HS_GEOS.forEach(function(p){ if(p[0]===_hsGeo) curGeo=p; });
    var rows=(lists[_hsGeo]||[]).filter(function(it){ return _hsCat==='all'||hsCatOf(it)===_hsCat; });
    var col=el('div','hs-col hs-col-single');
    col.appendChild(el('div','hs-col-head',(curGeo?curGeo[1]:_hsGeo)+' · 热门搜索 <span class="hs-count">'+(rows.length?rows.length+' 条':'0 条')+'</span>'));
    if(!rows.length){
      col.appendChild(el('div','hs-empty-note',
        _hsCat==='all'?('该市场本次未取到热搜'):((curGeo?curGeo[2]:HS_GEO_LABEL[_hsGeo]||'')+'榜今日无此类热搜')));
    }else{
      rows.forEach(function(it,idx){
        it=it||{};
        var row=el('div','hs-item');
        row.appendChild(el('span','hs-rank',String(it.rank!=null?it.rank:(idx+1))));
        var main=el('div','hs-main');
        main.appendChild(el('div','hs-q',esc(it.query||'')));
        var cat=hsCatOf(it);
        if(cat||it.traffic_text||it.traffic_num){
          var meta=el('div','hs-meta');
          if(it.traffic_text||it.traffic_num) meta.appendChild(el('span','hs-traffic','🔥 '+esc(it.traffic_text||String(it.traffic_num))));
          if(cat) meta.appendChild(el('span','hs-cat hs-cat-'+cat,esc(HS_CAT_LABEL[cat])));
          main.appendChild(meta);
        }
        var n=(it.news&&it.news[0])||null;
        if(n&&n.url){
          var a=el('a','hs-news');
          a.href=String(n.url); a.target='_blank'; a.rel='noopener';
          a.textContent=clipText(n.title||n.url,60)+(n.source?(' · '+n.source):'');
          a.title=String(n.title||n.url);
          main.appendChild(a);
        }else if(n&&n.title){
          // 源站链接实测失效时只保留标题文本，不给空链接
          main.appendChild(el('div','hs-news hs-news-plain',esc(clipText(n.title,60)+(n.source?(' · '+n.source):''))));
        }
        row.appendChild(main);
        col.appendChild(row);
      });
    }
    body.appendChild(col);
  }

  // ---------- 行业新闻（news_feed.groups：泰/马 × 电商/商业 四组）----------
  function renderNews(){
    var body=$('#news-body'); if(!body) return;
    body.innerHTML='';
    var nf=D.news_feed||{};
    var groups=(nf.groups||[]).filter(function(g){return g && g.key!=null;});
    if($('#news-src')) $('#news-src').textContent=String(nf.source||'Google News RSS（泰/马 · 电商服饰）');
    var total=0;
    groups.forEach(function(g){ total+=((g.items||[]).length); });
    if(!groups.length || !total){
      body.appendChild(el('div','news-empty','本次未取到新闻，原因见「数据渠道」板块'));
      return;
    }
    groups.forEach(function(g){
      var card=el('div','news-card');
      card.appendChild(el('div','news-card-head',esc(g.label||g.key)));
      var list=el('div','news-list');
      var items=g.items||[];
      if(!items.length) list.appendChild(el('div','news-empty-note','本组本次未取到新闻'));
      items.forEach(function(it){
        it=it||{};
        var item=el('div','news-item');
        var url=String(it.url||'');
        if(url){
          var a=el('a','news-title'); a.href=url; a.target='_blank'; a.rel='noopener';
          a.textContent=String(it.title||url);
          item.appendChild(a);
        }else{
          item.appendChild(el('div','news-title-plain',esc(it.title||'（无标题）')));
        }
        var meta=[];
        if(it.source) meta.push(String(it.source));
        if(it.published) meta.push(fxYmd(it.published));
        if(meta.length) item.appendChild(el('div','news-meta',esc(meta.join(' · '))));
        list.appendChild(item);
      });
      card.appendChild(list);
      body.appendChild(card);
    });
  }

  // ---------- 汇率 / 天气：字段归一化（契约新字段优先，旧 md 字段兜底）----------
  // 契约：fx{rates:{THB,MYR,CNY,USD}, thb_cny=CNY/THB, myr_cny=CNY/MYR, updated_at}
  //       weather{cities:[{city,temp,feels,humidity,desc,pm2_5,us_aqi,aqi_level,advice,forecast[]}]}
  // 旧数据只有 fx.TH.usd_thb、weather.TH（md 解析出的字符串），两条路都必须能渲染，不能白屏。
  function numOf(v){
    if(v==null || v==='') return null;
    var m=String(v).match(/-?\d+(\.\d+)?/);
    return m?parseFloat(m[0]):null;
  }
  // 时间戳统一成「YYYY-MM-DD HH:MM」（兼容 ISO 与 YYYY-MM-DD HH:MM[:SS]）
  function fxYmd(s){
    var t=String(s||'').trim(); if(!t) return '';
    var m=t.replace('T',' ').match(/(\d{4}-\d{2}-\d{2})(?:[ ]?(\d{2}:\d{2}))?/);
    return m?(m[1]+(m[2]?' '+m[2]:'')):t;
  }
  var FX_CODE={TH:'THB',MY:'MYR'};
  // 1 本币 = ? CNY。旧版把 thb_cny 写成 1/USD（0.0296、0.2451），量级明显不对 ⇒ 丢弃，按 rates 重算，
  // 页面上绝不出现这种反算出来的怪数字。
  function fxNorm(k){
    var f=D.fx||{}, r=f.rates||{}, legacy=(k==='TH'?f.TH:f.MY)||{};
    var code=FX_CODE[k]||'THB';
    var usd=numOf(r[code]); if(usd==null) usd=numOf(k==='TH'?legacy.usd_thb:legacy.usd_myr);
    var cny=numOf(r.CNY);
    var perCny=numOf(k==='TH'?f.thb_cny:f.myr_cny);
    var sane=(code==='THB')?0.05:0.5;                  // 低于此值必是 1/USD 的脏值
    if(perCny!=null && (perCny<sane || perCny>20)) perCny=null;
    if(perCny==null && usd && cny) perCny=Math.round(cny/usd*10000)/10000;
    var cnyPer=(usd && cny)?(Math.round(usd/cny*100)/100):null;   // 1 元 = ? 本币
    // 汇率已改为 open.er-api.com 实抓时，md 里那句「由工行现汇卖出价反推（CNY/THB≈…）」就是过时溯源，
    // 只保留后面真正的成本建议，避免页面上出现与真实汇率矛盾的括注。
    var _warn=String(legacy.cost_warn||'');
    if(String(f.source||'').indexOf('er-api')>=0) _warn=_warn.replace(/^[^；]*；[^；]*；/,'');
    return {code:code, usd:usd, perCny:perCny, cnyPer:cnyPer,
      updated:String(f.updated_at||f.fetched_at||''), warn:_warn};
  }
  function weatherNorm(){
    var w=D.weather||{};
    var arr=Object.prototype.toString.call(w.cities)==='[object Array]'?w.cities:[];
    if(arr.length){
      return arr.map(function(c){
        c=c||{};
        // 采集器给的是 key:'bkk' + country:'TH'；板块按 TH/MY 两列取数，所以优先用 country，
        // country 缺失时才退回 key（避免 key='BKK' 匹配不到 'TH' 导致天气整块显示「未取到」）
        var _k=String(c.country||'').toUpperCase();
        if(_k!=='TH' && _k!=='MY') _k=String(c.key||c.country||'').toUpperCase();
        return {key:_k, cityKey:String(c.key||''), city:String(c.city||''),
          temp:numOf(c.temp), feels:numOf(c.feels), humidity:numOf(c.humidity),
          desc:String(c.desc||''), pm25:numOf(c.pm2_5), aqi:numOf(c.us_aqi),
          aqiLevel:String(c.aqi_level||''), advice:String(c.advice||''),
          forecast:Object.prototype.toString.call(c.forecast)==='[object Array]'?c.forecast.slice(0,3):[],
          legacyTemp:'', legacyRain:'', alert:''};
      });
    }
    // 旧字段兜底：D.weather.TH / .MY
    return ['TH','MY'].map(function(k){
      var o=w[k]||{};
      return {key:k, city:String(o.city||(k==='TH'?'泰国':'马来西亚')),
        temp:null, feels:null, humidity:null, desc:'', pm25:null, aqi:null, aqiLevel:'',
        advice:String(o.advice||''), forecast:[],
        legacyTemp:String(o.temp||''), legacyRain:String(o.rain||''), alert:String(o.alert||'')};
    });
  }
  // us_aqi 越高底色越黄/红：只按数值上色，不预设「优/良/差」的固定语义色
  function aqiTint(aqi){
    if(aqi==null) return '';
    if(aqi<=50) return 'background:rgba(54,194,180,.16);border-color:rgba(54,194,180,.4)';
    if(aqi<=100) return 'background:rgba(255,225,110,.16);border-color:rgba(255,225,110,.42)';
    if(aqi<=150) return 'background:rgba(255,170,60,.2);border-color:rgba(255,170,60,.5)';
    return 'background:rgba(255,92,92,.22);border-color:rgba(255,92,92,.55)';
  }
  function weatherLine(w){
    if(!w) return '';
    var parts=[];
    if(w.city) parts.push(w.city);
    if(w.temp!=null) parts.push(w.temp+'°C'); else if(w.legacyTemp) parts.push(w.legacyTemp);
    if(w.feels!=null) parts.push('体感 '+w.feels+'°C');
    if(w.humidity!=null) parts.push('湿度 '+w.humidity+'%'); else if(w.legacyRain) parts.push('降雨 '+w.legacyRain);
    if(w.desc) parts.push(w.desc);
    return parts.join(' · ');
  }

  // ---------- 汇率天气 ----------
  function renderFxWeather(){
    var body=$('#fx-body'); if(!body) return;
    body.innerHTML='';
    var frow=function(k,v){var r=el('div','fx-row');r.appendChild(el('span','k',k));r.appendChild(el('span','v',v));return r;};
    var cities=weatherNorm();
    ['TH','MY'].forEach(function(k){
      var fx=fxNorm(k), city=null;
      cities.forEach(function(c){ if(!city && c.key===k) city=c; });
      if(!city && cities.length && cities.length<2) city=cities[0];
      var card=el('div','fx-card');
      card.appendChild(el('h3',null,(k==='TH'?'🇹🇭 ':'🇲🇾 ')+esc((city&&city.city)||(k==='TH'?'泰国':'马来西亚'))));
      // 汇率：真实字段缺失就明说，不用反算数字凑
      if(fx.usd!=null) card.appendChild(frow('1 USD','≈ '+esc(fx.usd)+' '+fx.code));
      if(fx.perCny!=null) card.appendChild(frow('1 '+fx.code,'≈ '+esc(fx.perCny)+' 元'));
      if(fx.cnyPer!=null) card.appendChild(frow('1 元','≈ '+esc(fx.cnyPer)+' '+fx.code));
      if(fx.updated) card.appendChild(frow('汇率更新时间',esc(fxYmd(fx.updated))));
      if(fx.usd==null && fx.perCny==null) card.appendChild(el('div','fx-muted','本次未取到汇率数值'));
      // 天气：cities[] 优先，缺了就退回旧字段的字符串温度/降雨
      if(city){
        var line=weatherLine(city);
        if(line) card.appendChild(frow('🌡️ 天气',esc(line)));
        if(city.pm25!=null || city.aqi!=null || city.aqiLevel){
          var chips=el('div','fx-aqi');
          chips.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
          if(city.pm25!=null){
            var p=el('span','aqi-chip','PM2.5 '+city.pm25);
            p.style.cssText=aqiTint(city.pm25>150?160:(city.pm25>75?110:(city.pm25>35?70:30)));
            chips.appendChild(p);
          }
          if(city.aqi!=null || city.aqiLevel){
            var c=el('span','aqi-chip','AQI '+(city.aqi!=null?city.aqi:'—')+(city.aqiLevel?(' · '+city.aqiLevel):''));
            c.style.cssText=aqiTint(city.aqi);
            chips.appendChild(c);
          }
          card.appendChild(chips);
        }
        if(city.advice){
          // 建议/预警类长文本来自每日 md 正文，可能带着前一天的日期标签（如「【2026-10-23 晚间更新】」）。
          // 与 meta.date 不一致时明确标注，避免把隔夜文本当成今日结论。
          var _ad=String(city.advice);
          var _d=(_ad.match(/20\d\d-\d\d-\d\d/)||[])[0]||'';
          var _today=String(((D.meta||{}).date)||'');
          if(_d && _today && _d!==_today){
            var _tag=el('div','fx-stale','⚠️ 下面这段是 '+_d+' 的研判快照，今日未刷新；温度/湿度/AQI 为实时抓取');
            _tag.style.cssText='margin-top:10px;padding:7px 10px;border-radius:8px;background:rgba(255,190,80,.12);'
              +'border:1px solid rgba(255,190,80,.34);color:#ffce8a;font-size:12px;line-height:1.5';
            card.appendChild(_tag);
          }
          card.appendChild(el('div','fx-advice',esc(_ad)));
        }
        if(city.alert) card.appendChild(el('div','fx-alert','⛔ '+esc(city.alert)));
        if(city.forecast && city.forecast.length){
          var fc=el('div','fx-fc');
          fc.appendChild(el('div','fx-fc-head','未来 3 天'));
          city.forecast.forEach(function(d){
            d=d||{};
            var row=el('div','fx-fc-row');
            row.appendChild(el('span','d',esc(String(d.date||'').slice(5)||'—')));
            row.appendChild(el('span','t',esc((d.max!=null?d.max+'°':'—')+' / '+(d.min!=null?d.min+'°':'—'))));
            row.appendChild(el('span','p',esc(d.precip!=null?('降水 '+d.precip+'%'):'')));
            fc.appendChild(row);
          });
          card.appendChild(fc);
        }
      }else{
        card.appendChild(el('div','fx-muted','本次未取到天气数据'));
      }
      if(fx.warn) card.appendChild(el('div','fx-warn','⚠️ '+esc(fx.warn)));
      card.onclick=function(){showFxDetail(k);};
      body.appendChild(card);
    });
  }

  // ---------- 汇率天气：浏览器端实时拉取（保证页面打开即最新） ----------
  // 写的是契约字段（rates / thb_cny / myr_cny），顺带同步旧键，避免旧读取路径拿到空值。
  function fetchLiveFxWeather(){
    if(typeof fetch!=='function') return;
    var pending=0;
    function once(){ if(--pending<=0) markLive(); }
    function markLive(){
      var h=document.querySelector('#sec-fx h2');
      if(h && !document.getElementById('fx-live-badge')){
        var b=el('span','live-badge','🔴 浏览器实时'); b.id='fx-live-badge'; h.appendChild(b);
      }
    }
    pending+=1;
    fetch('https://api.exchangerate-api.com/v4/latest/USD').then(function(r){return r.json();}).then(function(j){
      if(!(j && j.rates && j.rates.THB && j.rates.MYR)) return;
      var r=j.rates, cny=r.CNY||1;
      D.fx=D.fx||{};
      D.fx.rates={THB:r.THB, MYR:r.MYR, CNY:cny, USD:r.USD||1};
      D.fx.thb_cny=Math.round(cny/r.THB*10000)/10000;
      D.fx.myr_cny=Math.round(cny/r.MYR*10000)/10000;
      D.fx.updated_at=new Date().toISOString();
      D.fx.TH=D.fx.TH||{}; D.fx.MY=D.fx.MY||{};
      D.fx.TH.usd_thb=String(r.THB.toFixed(2)); D.fx.MY.usd_myr=String(r.MYR.toFixed(2));
      D.fx.TH.thb_cny=String(D.fx.thb_cny);     D.fx.MY.myr_cny=String(D.fx.myr_cny);
      renderFxWeather();
    }).catch(function(e){}).then(once);
    // 天气：命中 cities[] 就就地更新，否则退回旧键
    [{k:'TH',lat:13.7563,lon:100.5018,city:'曼谷'},{k:'MY',lat:3.1390,lon:101.6869,city:'吉隆坡'}].forEach(function(rq){
      pending++;
      var url='https://api.open-meteo.com/v1/forecast?latitude='+rq.lat+'&longitude='+rq.lon+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability&timezone=Asia/Bangkok';
      fetch(url).then(function(r){return r.json();}).then(function(j){
        if(!(j && j.current)) return;
        var cur=j.current, w=D.weather=D.weather||{};
        if(Object.prototype.toString.call(w.cities)==='[object Array]'){
          var hit=null;
          w.cities.forEach(function(c){ if(!hit && c && String(c.key||c.country||'').toUpperCase()===rq.k) hit=c; });
          if(!hit) return;
          hit.city=hit.city||rq.city;
          hit.temp=Math.round(cur.temperature_2m*10)/10;
          if(cur.apparent_temperature!=null) hit.feels=Math.round(cur.apparent_temperature*10)/10;
          if(cur.relative_humidity_2m!=null) hit.humidity=cur.relative_humidity_2m;
          renderFxWeather();
        }else{
          w[rq.k]=w[rq.k]||{};
          w[rq.k].city=rq.city;
          w[rq.k].temp=cur.temperature_2m+'°C';
          w[rq.k].rain=(cur.precipitation_probability||0)+'%';
          renderFxWeather();
        }
      }).catch(function(e){}).then(once);
    });
  }
  // ---------- 市场大盘 ----------
  function renderMarket(){
    var box=$('#market-body'); if(!box) return;
    box.innerHTML='';
    var mw=(D.meta&&D.meta.market_watch)||[];
    if(!mw.length){ box.innerHTML='<div style="padding:18px;color:#8fa3b8">暂无市场大盘数据</div>'; return; }
    var wrap=el('div','table-wrap');
    var t=el('table','grid-table');
    t.innerHTML='<thead><tr><th>指标</th><th>数值</th><th>口径</th><th>来源</th></tr></thead>';
    var tb=el('tbody');
    mw.forEach(function(r){
      var tr=el('tr');
      tr.innerHTML='<td>'+esc(r.metric)+'</td><td><b>'+esc(r.value)+'</b></td><td>'+esc(r.note||'')+'</td><td>'+esc(r.source||'')+'</td>';
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); box.appendChild(wrap);
  }

  // ---------- 板块级说明（导语）----------
  // 数据来自 extract 的 data.section_notes（纯文本段落，已剥 markdown 标记）。
  // 幂等：每次先 innerHTML='' 再重建，重复调用不会叠加（同 renderCompetitors 口径）。
  // 2026-11-09 补齐到 11 个板块：此前只挂 3 个，entertainment / global_trends 及
  // 01/02/03/07/10/11 的导语均"写了不上屏"。
  var NOTE_SLOTS={competitors:'#note-competitors',
                  search_rankings:'#note-search_rankings',
                  bestsellers:'#note-bestsellers',
                  entertainment:'#note-entertainment',
                  global_trends:'#note-global_trends',
                  n_countdown:'#note-n_countdown',
                  n_holidays:'#note-n_holidays',
                  n_online_festivals:'#note-n_online_festivals',
                  n_keywords:'#note-n_keywords',
                  n_fx:'#note-n_fx',
                  n_weather:'#note-n_weather'};
  function renderSectionNotes(){
    var notes=D.section_notes||{};
    Object.keys(NOTE_SLOTS).forEach(function(k){
      var box=$(NOTE_SLOTS[k]); if(!box) return;
      var arr=notes[k]||[];
      box.innerHTML='';
      if(!arr.length) return;
      arr.forEach(function(txt){
        var p=document.createElement('p');
        p.textContent=txt;
        box.appendChild(p);
      });
    });
  }

  // ---------- 启动 ----------
  function renderAll(){
    recomputeHolidays();
    renderKPI();
    renderSectionNotes();
    renderCountdown();
    renderMarket();
    renderOnlineFestivals();
    renderCompetitors();
    renderSearch();
    renderBestsellers();
    renderIpHotspots();
    renderGlobal();
    renderEntertainment();
    renderAnimeFilm();
    renderHotSearch();
    renderNews();
    renderLiveTrends();
    renderLiveSources();
    renderFxWeather();
  }
  window.addEventListener('resize',function(){ if(_cdChart) _cdChart.resize(); });
  renderAll();
  fetchLiveFxWeather();
  applyTimeHeat();     // 初始化「时间 × 热度」筛选条（默认全部 × 全部，数据保持原样）
  }
  loadData(boot);
})();
