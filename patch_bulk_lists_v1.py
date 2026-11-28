# patch_bulk_lists_v1.py -- MK Day: bulk select / hide / restore / delete in তালিকা ব্যবস্থাপনা (আয়/ব্যয়)
# Run inside the repo folder:  python3 patch_bulk_lists_v1.py
import re,sys
p='index.html'
s=open(p,encoding='utf8').read()
if 'BULK_LISTS_V1' in s:
    print('already applied');sys.exit(0)

FUNCS = r'''/*BULK_LISTS_V1*/
var catSel={};
function catSelKey(t,c){return t+'|'+(c||'')}
function catSelList(t,c){const k=catSelKey(t,c);if(!Array.isArray(catSel[k]))catSel[k]=[];return catSel[k]}
function catItemNames(t,c){const C=cc(t);if(!c)return Object.keys(C).filter(k=>k!=='সাধারণ');return (C[c]||[]).map(v=>typeof v==='string'?v:(v&&v.n)||String(v))}
function catHiddenArr(t,c){if(!c){const key=t==='i'?'incomeHidden':'expenseHidden';D[key]=Array.isArray(D[key])?D[key]:[];return D[key]}const key=t==='i'?'incomeSubHidden':'expenseSubHidden';D[key]=D[key]&&typeof D[key]==='object'&&!Array.isArray(D[key])?D[key]:{};D[key][c]=Array.isArray(D[key][c])?D[key][c]:[];return D[key][c]}
function catChk(t,c,name){return '<input type="checkbox" '+(catSelList(t,c).includes(name)?'checked ':'')+'style="width:22px;height:22px;margin-right:8px;flex:none;accent-color:#185FA5" onclick="event.stopPropagation();catSelToggle(\''+t+'\',&quot;'+htmlEsc(c||'')+'&quot;,&quot;'+htmlEsc(name)+'&quot;)">'}
function catSelToggle(t,c,name){const L=catSelList(t,c),i=L.indexOf(name);i<0?L.push(name):L.splice(i,1);R()}
function catSelAll(t,c){const all=catItemNames(t,c),L=catSelList(t,c);catSel[catSelKey(t,c)]=L.length===all.length?[]:all.slice();R()}
function catBulkHide(t,c,hide){const L=catSelList(t,c).slice();if(!L.length)return toast('আগে কিছু নির্বাচন করুন');const H=catHiddenArr(t,c);L.forEach(n=>{const i=H.indexOf(n);if(hide&&i<0)H.push(n);if(!hide&&i>=0)H.splice(i,1)});catSel[catSelKey(t,c)]=[];save();R();toast(hide?L.length+'টি লুকানো হলো':L.length+'টি ফিরিয়ে আনা হলো')}
function catRestoreAll(t,c){const H=catHiddenArr(t,c);if(!H.length)return toast('কোনো লুকানো আইটেম নেই');const n=H.length;H.length=0;save();R();toast(n+'টি ফিরিয়ে আনা হলো')}
function catBulkDelete(t,c){const L=catSelList(t,c).slice();if(!L.length)return toast('আগে কিছু নির্বাচন করুন');const C=cc(t);let keep=[],del=[];L.forEach(n=>{if(!c){const used=(D.tx||[]).some(x=>x.t==t&&x.c==n);(used||n==='সাধারণ'?keep:del).push(n)}else del.push(n)});if(!del.length)return toast('নির্বাচিতগুলোতে পুরোনো লেনদেন আছে, তাই মুছা যাবে না');yn(del.length+'টি মুছবেন?'+(keep.length?' ('+keep.length+'টিতে পুরোনো লেনদেন আছে, সেগুলো থাকবে)':''),()=>{const H=catHiddenArr(t,c);if(!c){del.forEach(n=>{delete C[n];const i=H.indexOf(n);if(i>=0)H.splice(i,1)})}else{C[c]=(C[c]||[]).filter(v=>!del.includes(typeof v==='string'?v:(v&&v.n)||String(v)));del.forEach(n=>{const i=H.indexOf(n);if(i>=0)H.splice(i,1)})}catSel[catSelKey(t,c)]=[];save();R()})}
function catBulkBar(t,c){const all=catItemNames(t,c),n=catSelList(t,c).length,hid=catHiddenArr(t,c).length,b='class="btn" style="width:auto;padding:8px 10px;font-size:12px;margin:0 6px 6px 0;background:';const a="&quot;"+htmlEsc(c||'')+"&quot;";return '<div style="display:flex;flex-wrap:wrap;margin:6px 0 4px"><button '+b+'#185FA5" onclick="catSelAll(\''+t+'\','+a+')">☑ '+(n&&n===all.length?'সব বাদ দিন':'সব নির্বাচন')+' ('+n+'/'+all.length+')</button><button '+b+'#64748b" onclick="catBulkHide(\''+t+'\','+a+',true)">🙈 নির্বাচিত লুকান</button><button '+b+'#1a9e4b" onclick="catBulkHide(\''+t+'\','+a+',false)">↩ নির্বাচিত ফিরিয়ে আনুন</button><button '+b+'#b71c1c" onclick="catBulkDelete(\''+t+'\','+a+')">🗑 নির্বাচিত মুছুন</button><button '+b+'#7c3aed" onclick="catRestoreAll(\''+t+'\','+a+')">↩ সব ফিরিয়ে আনুন'+(hid?' ('+hid+')':'')+'</button></div>'}
'''
anchor='function catalogToggleCategoryHidden'
assert s.count(anchor)==1,'anchor'
s=s.replace(anchor,FUNCS+anchor,1)

def rep(old,new):
    global s
    assert s.count(old)==1,('not unique/missing',old[:60],s.count(old))
    s=s.replace(old,new,1)

# row checkboxes
rep("""const off=hidden.includes(k);return '<div class="row"><span""","""const off=hidden.includes(k);return '<div class="row">'+catChk(t,'',k)+'<span""")
rep("""off=hidden.includes(name),hasDetails=t==='i'&&k==='ব্যবসা'&&Array.isArray((D.businessDetails&&D.businessDetails[name])||BUSINESS_DETAILS[name]);return '<div class="row"><span""","""off=hidden.includes(name),hasDetails=t==='i'&&k==='ব্যবসা'&&Array.isArray((D.businessDetails&&D.businessDetails[name])||BUSINESS_DETAILS[name]);return '<div class="row">'+catChk(t,k,name)+'<span""")
# bars
rep("""পুরোনো হিসাব অক্ষত থাকবে।</p>'+rows+""","""পুরোনো হিসাব অক্ষত থাকবে।</p>'+catBulkBar(t,'')+rows+""")
rep("""সাব-ক্যাটাগরি পরিচালনা করুন।')+'</p>'+(rows||""","""সাব-ক্যাটাগরি পরিচালনা করুন।')+'</p>'+catBulkBar(t,k)+(rows||""")
open(p,'w',encoding='utf8').write(s)

# service worker cache bump
w=open('sw.js',encoding='utf8').read()
m=re.search(r"mkc-v(\d+)",w)
if m:
    w=w.replace(m.group(0),'mkc-v'+str(int(m.group(1))+1),1)
    open('sw.js','w',encoding='utf8').write(w)
print('done')
