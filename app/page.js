"use client";
import { useState } from "react";

const SECTORS = ["Restaurant / Café","Coiffure & Beauté","Coach sportif / Fitness","Artisan (BTP, plomberie…)","Boutique / E-commerce","Photographe","Avocat / Cabinet","Immobilier","Agence com / marketing","Freelance / Consultant","Santé / Bien-être","Événementiel","Auto / Garage","Éducation / Formation","Autre"];
const STYLES = ["Auto","Élégant & premium","Fun & coloré","Corporate & sérieux","Minimaliste","Audacieux & créatif","Chaleureux & authentique"];

const CSS = `
:root{--bg:#0B0D10;--panel:#121519;--panel2:#1A1E24;--line:#272C34;--text:#F2F3F5;--muted:#8B929C;--violet:#A78BFA;--mint:#34D399;--lime:#C6F24E}
*{box-sizing:border-box}body{margin:0}
.app{display:grid;grid-template-columns:400px 1fr;height:100vh;font-family:ui-sans-serif,system-ui,sans-serif;background:var(--bg);color:var(--text)}
input,textarea,select{width:100%;background:var(--panel2);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:11px 13px;font-size:14px;outline:none;font-family:inherit}
input:focus,textarea:focus,select:focus{border-color:var(--violet)}::placeholder{color:#5b626c}textarea{resize:vertical;min-height:64px}
button{font-family:inherit;cursor:pointer}
.left{border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
.brand{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:11px}
.logo{width:32px;height:32px;border-radius:9px;background:linear-gradient(110deg,var(--violet),var(--mint),var(--lime));background-size:200% 200%;animation:sh 6s linear infinite;display:flex;align-items:center;justify-content:center;font-size:17px}
.brand h1{font-size:16px;font-weight:800;margin:0}.brand p{font-size:11px;color:var(--muted);margin:0}
.scroll{flex:1;overflow-y:auto;padding:18px 20px}
.field{margin-bottom:13px}.field label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.toggle{display:flex;align-items:center;gap:11px;margin:6px 0;cursor:pointer;user-select:none}
.switch{width:42px;height:24px;border-radius:999px;background:var(--line);position:relative;transition:.2s;flex-shrink:0}.switch.on{background:var(--violet)}
.knob{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s}.switch.on .knob{left:21px}
.cta{width:100%;margin-top:8px;padding:14px;border:none;border-radius:12px;font-weight:800;font-size:15px;color:#0B0D10;background:linear-gradient(110deg,var(--violet),var(--mint),var(--lime));background-size:200% 200%;animation:sh 6s linear infinite}
.cta:disabled{opacity:.65}
.st{font-size:12px;font-weight:700;color:var(--muted);letter-spacing:.05em;margin:22px 0 10px;text-transform:uppercase}
.chat{display:flex;flex-direction:column;gap:8px}.msg{font-size:13px;line-height:1.5;padding:10px 12px;border-radius:10px}
.msg.user{background:var(--panel2);border:1px solid var(--line)}.msg.bot{color:var(--mint);font-weight:600}
.chatbar{padding:14px 20px;border-top:1px solid var(--line);display:flex;gap:8px}
.send{background:var(--violet);border:none;color:#0B0D10;font-weight:700;border-radius:10px;padding:0 16px}
.err{background:rgba(255,90,77,.12);border:1px solid rgba(255,90,77,.4);color:#FF8A80;padding:10px 12px;border-radius:10px;font-size:13px;margin-top:12px}
.right{display:flex;flex-direction:column;min-width:0;background:#070809}
.bar{padding:11px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.tabs,.seg{display:flex;gap:4px;background:var(--panel);border-radius:9px;padding:3px}
.tabs button,.seg button{border:none;background:transparent;color:var(--muted);padding:7px 14px;border-radius:7px;font-size:13px;font-weight:600}
.tabs button.active,.seg button.active{background:var(--panel2);color:var(--text)}
.btn{display:flex;align-items:center;gap:6px;border:1px solid var(--line);background:transparent;color:var(--muted);padding:8px 13px;border-radius:9px;font-size:13px;font-weight:600}
.btn.primary{border:none;background:var(--lime);color:#0B0D10}
.stage{flex:1;display:flex;align-items:center;justify-content:center;overflow:auto}.stage.mobile{padding:22px}
.fw{width:100%;height:100%;background:#fff}.fw.mobile{width:390px;max-width:100%;height:100%;max-height:780px;border:8px solid #1a1d22;border-radius:28px;overflow:hidden}
iframe.pv{width:100%;height:100%;border:none;display:block}
.code{width:100%;height:100%;margin:0;padding:18px;overflow:auto;font-family:ui-monospace,monospace;font-size:12.5px;line-height:1.6;color:#cdd3da;white-space:pre-wrap;word-break:break-word}
.empty{text-align:center;color:var(--muted);max-width:380px;padding:30px}.empty .logo{width:64px;height:64px;border-radius:18px;margin:0 auto 18px;font-size:30px}.empty h2{color:var(--text);font-size:21px;margin:0 0 9px}
.spin{width:16px;height:16px;border:2px solid rgba(11,13,16,.35);border-top-color:#0B0D10;border-radius:50%;animation:rot .8s linear infinite;display:inline-block}
@keyframes sh{0%{background-position:0% 50%}100%{background-position:200% 50%}}@keyframes rot{to{transform:rotate(360deg)}}
@media(max-width:860px){.app{grid-template-columns:1fr;grid-template-rows:auto 1fr;height:auto;min-height:100vh}.left{max-height:55vh}}
`;

function clean(s){let t=(s||"").trim();t=t.replace(/^\`\`\`(?:html)?/i,"").replace(/\`\`\`$/i,"").trim();const i=t.indexOf("<!DOCTYPE");const j=t.toLowerCase().lastIndexOf("</html>");if(i>=0&&j>i)t=t.slice(i,j+7);return t;}

export default function Home(){
  const [brief,setBrief]=useState({name:"",sector:SECTORS[0],goal:"",services:"",city:"",email:"",phone:"",style:STYLES[0],sections:"",threed:true});
  const [html,setHtml]=useState("");const [raw,setRaw]=useState("");const [busy,setBusy]=useState(false);const [err,setErr]=useState("");
  const [tab,setTab]=useState("preview");const [device,setDevice]=useState("desktop");const [chat,setChat]=useState([]);const [instr,setInstr]=useState("");
  const set=(k)=>(e)=>setBrief((b)=>({...b,[k]:e.target.value}));

  async function stream(payload,onDone){
    setErr("");setBusy(true);setRaw("");setTab("preview");
    try{
      const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if(!res.ok){throw new Error(await res.text()||("Erreur "+res.status));}
      const reader=res.body.getReader();const dec=new TextDecoder();let acc="";
      while(true){const{done,value}=await reader.read();if(done)break;acc+=dec.decode(value,{stream:true});setRaw(acc);}
      if(acc.includes("ERREUR_API")||acc.startsWith("ERREUR"))throw new Error(acc.replace(/<!--|-->/g,"").trim());
      const out=clean(acc);if(!out||out.length<30)throw new Error("Réponse vide.");
      setHtml(out);if(onDone)onDone();
    }catch(e){setErr(e.message||String(e));}finally{setBusy(false);}
  }
  function generate(){if(!brief.name.trim()&&!brief.sector){setErr("Indique le nom ou le secteur.");return;}setChat([{role:"user",text:"Génère : "+(brief.name||brief.sector)}]);stream({mode:"create",brief},()=>setChat((c)=>[...c,{role:"bot",text:"✓ Site généré"}]));}
  function refine(){const t=instr.trim();if(!t||!html)return;setInstr("");setChat((c)=>[...c,{role:"user",text:t}]);stream({mode:"edit",html,instruction:t},()=>setChat((c)=>[...c,{role:"bot",text:"✓ Mis à jour"}]));}
  function download(){if(!html)return;const b=new Blob([html],{type:"text/html"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=(brief.name||"site").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".html";a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);}
  function openTab(){if(!html)return;const w=window.open();if(w){w.document.open();w.document.write(html);w.document.close();}}
  const show=busy?raw:html;

  return(<><style>{CSS}</style><div className="app">
    <div className="left">
      <div className="brand"><div className="logo">🦎</div><div><h1>Caméléon Studio</h1><p>Décris ton activité, l'IA construit le site.</p></div></div>
      <div className="scroll">
        <div className="field"><label>Nom de l'activité</label><input value={brief.name} onChange={set("name")} placeholder="Ex : Pizzeria Bella"/></div>
        <div className="field"><label>Secteur</label><select value={brief.sector} onChange={set("sector")}>{SECTORS.map((s)=><option key={s}>{s}</option>)}</select></div>
        <div className="field"><label>Objectif du site</label><input value={brief.goal} onChange={set("goal")} placeholder="Ex : prendre des réservations"/></div>
        <div className="field"><label>Services / offres</label><textarea value={brief.services} onChange={set("services")} placeholder="Ex : pizzas au feu de bois, livraison…"/></div>
        <div className="row2"><div className="field"><label>Ville</label><input value={brief.city} onChange={set("city")} placeholder="Toulouse"/></div>
          <div className="field"><label>Ambiance</label><select value={brief.style} onChange={set("style")}>{STYLES.map((s)=><option key={s}>{s}</option>)}</select></div></div>
        <div className="row2"><div className="field"><label>Email</label><input value={brief.email} onChange={set("email")} placeholder="contact@…"/></div>
          <div className="field"><label>Téléphone</label><input value={brief.phone} onChange={set("phone")} placeholder="06 …"/></div></div>
        <div className="field"><label>Sections en plus (optionnel)</label><input value={brief.sections} onChange={set("sections")} placeholder="Ex : FAQ, galerie, tarifs"/></div>
        <div className="toggle" onClick={()=>setBrief((b)=>({...b,threed:!b.threed}))}><span className={"switch"+(brief.threed?" on":"")}><span className="knob"/></span><span style={{fontSize:13,fontWeight:600}}>Hero 3D animé (WebGL)</span></div>
        <button className="cta" onClick={generate} disabled={busy}>{busy&&chat.length<=1?<><span className="spin"/> Génération…</>:(html?"↻ Régénérer":"✨ Générer le site")}</button>
        {err&&<div className="err">{err}</div>}
        {chat.length>0&&<><div className="st">Conversation</div><div className="chat">{chat.map((m,i)=><div key={i} className={"msg "+m.role}>{m.text}</div>)}{busy&&chat.length>1&&<div className="msg bot">…en cours</div>}</div></>}
      </div>
      {html&&<div className="chatbar"><input value={instr} onChange={(e)=>setInstr(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"&&!busy)refine();}} placeholder="Demande une modif : « hero plus sombre »…"/><button className="send" onClick={refine} disabled={busy||!instr.trim()}>↑</button></div>}
    </div>
    <div className="right">
      <div className="bar">
        <div className="tabs"><button className={tab==="preview"?"active":""} onClick={()=>setTab("preview")}>Aperçu</button><button className={tab==="code"?"active":""} onClick={()=>setTab("code")}>Code</button></div>
        {tab==="preview"&&html&&<div className="seg"><button className={device==="desktop"?"active":""} onClick={()=>setDevice("desktop")}>Bureau</button><button className={device==="mobile"?"active":""} onClick={()=>setDevice("mobile")}>Mobile</button></div>}
        {html&&<div style={{display:"flex",gap:8}}><button className="btn" onClick={openTab}>Ouvrir ↗</button><button className="btn primary" onClick={download}>Télécharger</button></div>}
      </div>
      {!show?<div className="stage"><div className="empty"><div className="logo">🦎</div><h2>Ton site apparaîtra ici</h2><p>Remplis le brief puis clique sur Générer. Ensuite, affine au fil de la discussion.</p></div></div>
      :tab==="code"?<pre className="code">{show}</pre>
      :<div className={"stage"+(device==="mobile"?" mobile":"")}><div className={"fw"+(device==="mobile"?" mobile":"")}><iframe className="pv" title="aperçu" sandbox="allow-scripts allow-popups" srcDoc={show}/></div></div>}
    </div>
  </div></>);
}
