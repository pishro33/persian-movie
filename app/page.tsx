"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {Menu, X} from "lucide-react";
const movies=[
 {id:"taxidermy",title:"Taxidermy",titleFa:"تاکسیدرمی",year:"2026",cat:"Comedy",style:""},
 {id:"safar-be-limoonia",title:"Safar Be Limoonia",titleFa:"سفر به لیمونیا",year:"2026",cat:"Family",style:"p2"},
 {id:"lebas-shaksi",title:"Lebas Shaksi",titleFa:"لباس شخصی",year:"2026",cat:"Thriller",style:"p3"},
 {id:"harchi-to-begi",title:"Harchi to Begi",titleFa:"هرچی تو بگی",year:"2026",cat:"Comedy",style:"p4"},
 {id:"ghomarbaz",title:"Ghomarbaz",titleFa:"قمارباز",year:"2026",cat:"Mystery",style:"p2"},
 {id:"balit",title:"Balit",titleFa:"بالیت",year:"2026",cat:"Drama",style:"p3"},
 {id:"mashqe-emshab",title:"Mashqe emshab",titleFa:"مشق امشب",year:"2026",cat:"Documentary",style:"p4"},
 {id:"khab-nama",title:"Khab Nama",titleFa:"خواب‌نما",year:"2026",cat:"Comedy",style:""}
];
const cats=["All","Comedy","Family","Thriller","Mystery","Drama","Documentary"];
const catFa:Record<string,string>={Comedy:"کمدی",Family:"خانوادگی",Thriller:"هیجان‌انگیز",Mystery:"معمایی",Drama:"درام",Documentary:"مستند"};
export default function Home(){
 const [cat,setCat]=useState("All"),[query,setQuery]=useState(""),[open,setOpen]=useState(false);
 const shown=useMemo(()=>movies.filter(m=>(cat==="All"||m.cat===cat)&&(`${m.title} ${m.titleFa}`.toLowerCase().includes(query.toLowerCase()))),[cat,query]);
 return <main className="shell"><div className="wrap">
 <header className="header"><Link className="brand" href="/">Persian<b>Movie</b></Link><nav className="nav"><a href="#home">خانه</a><a href="#movies">فیلم‌ها</a><a href="#series">سریال‌ها</a><a href="#live">پخش زنده</a></nav><div className="actions"><input className="search" aria-label="جست‌وجو" placeholder="جست‌وجوی فیلم..." value={query} onChange={e=>setQuery(e.target.value)}/><button className="menu" aria-label="باز کردن منو" onClick={()=>setOpen(true)}><Menu/></button></div></header>
 <section className="hero" id="home"><div dir="rtl" className="hero-copy"><div className="eyebrow">دنیایی از داستان‌ها · سینمای ایران</div><h1>داستان بعدیِ <span>موردعلاقه‌ات</span> را پیدا کن.</h1><p className="copy">فیلم‌ها و سریال‌های ایرانی را کشف کن، تازه‌ترین آثار را ببین و داستان‌های ماندگار سینمای ایران را دوباره تجربه کن.</p><a className="cta" href="#movies">تماشای فیلم‌ها&nbsp; ←</a></div><div className="feature"><div><div className="eyebrow">منتخب سردبیر</div><strong>داستان‌هایی که می‌مانند.</strong></div></div></section>
 <section id="movies"><div className="section-head"><div dir="rtl"><div className="eyebrow">آرشیو فیلم‌ها · ۶۲۲ عنوان</div><h2>جدیدترین فیلم‌ها</h2></div><span className="eyebrow">به‌روزرسانی بر اساس آرشیو</span></div><div className="filters">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`filter ${cat===c?"active":""}`}>{c==="All"?"همه":catFa[c]}</button>)}</div><div className="grid">{shown.length?shown.map(m=><Link className="movie" href={`/movie/${m.id}`} key={m.id}><div className={`poster ${m.style}`} role="img" aria-label={`پوستر ${m.titleFa}`}><strong dir="rtl">{m.titleFa}</strong><span className="poster-hint">پوستر فیلم</span></div><div className="meta" dir="rtl"><span>{m.year}</span><span>{catFa[m.cat]}</span></div></Link>):<p dir="rtl">فیلمی با این مشخصات پیدا نشد.</p>}</div></section>
 <footer className="footer"><span>© ۲۰۲۶ Persian Movie</span><span>خانه‌ای برای داستان‌های ایرانی</span></footer></div>
 <div className={`drawer ${open?"open":""}`} onClick={()=>setOpen(false)}><div className="panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(false)} aria-label="بستن منو"><X/></button><div className="brand">Persian<b>Movie</b></div><nav><a href="#home" onClick={()=>setOpen(false)}>خانه</a><a href="#movies" onClick={()=>setOpen(false)}>فیلم‌ها</a><a href="#series" onClick={()=>setOpen(false)}>سریال‌ها</a><a href="#live" onClick={()=>setOpen(false)}>پخش زنده</a><a href="#about" onClick={()=>setOpen(false)}>درباره ما</a></nav></div></div></main>;
}
