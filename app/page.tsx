"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {Menu, X} from "lucide-react";
const movies=[
 {id:"taxidermy",title:"Taxidermy",titleFa:"تاکسیدرمی",year:"2024",genre:"Drama",rating:"7.8",cat:"Drama",style:""},
 {id:"last-window",title:"The Last Window",titleFa:"آخرین پنجره",year:"2025",genre:"Mystery",rating:"8.1",cat:"Mystery",style:"p2"},
 {id:"blue-hour",title:"Blue Hour",titleFa:"ساعت آبی",year:"2024",genre:"Drama",rating:"7.5",cat:"Drama",style:"p3"},
 {id:"desert-road",title:"Desert Road",titleFa:"جادهٔ کویر",year:"2025",genre:"Adventure",rating:"8.3",cat:"Adventure",style:"p4"},
 {id:"quiet-city",title:"The Quiet City",titleFa:"شهر خاموش",year:"2023",genre:"Drama",rating:"7.9",cat:"Drama",style:"p2"},
 {id:"second-sun",title:"Second Sun",titleFa:"خورشید دوم",year:"2025",genre:"Romance",rating:"7.6",cat:"Romance",style:"p3"},
 {id:"midnight-letter",title:"Midnight Letter",titleFa:"نامهٔ نیمه‌شب",year:"2024",genre:"Mystery",rating:"8.0",cat:"Mystery",style:"p4"},
 {id:"winter-garden",title:"Winter Garden",titleFa:"باغ زمستانی",year:"2023",genre:"Drama",rating:"7.4",cat:"Drama",style:""}
];
const cats=["All","Drama","Mystery","Adventure","Romance"];
export default function Home(){
 const [cat,setCat]=useState("All"),[query,setQuery]=useState(""),[open,setOpen]=useState(false);
 const shown=useMemo(()=>movies.filter(m=>(cat==="All"||m.cat===cat)&&(`${m.title} ${m.titleFa}`.toLowerCase().includes(query.toLowerCase()))),[cat,query]);
 return <main className="shell"><div className="wrap">
 <header className="header"><Link className="brand" href="/">Persian<b>Movie</b></Link><nav className="nav"><a href="#home">Home</a><a href="#movies">Movies</a><a href="#series">Series</a><a href="#live">Live TV</a></nav><div className="actions"><input className="search" aria-label="جست‌وجو" placeholder="جست‌وجوی فیلم..." value={query} onChange={e=>setQuery(e.target.value)}/><button className="menu" aria-label="باز کردن منو" onClick={()=>setOpen(true)}><Menu/></button></div></header>
 <section className="hero" id="home"><div><div className="eyebrow">A world of stories · Iranian cinema</div><h1>Find your next <span>favorite</span> story.</h1><p className="copy">Explore Persian movies and series, discover new releases, and revisit memorable stories from Iranian cinema.</p><a className="cta" href="#movies">تماشای فیلم‌ها&nbsp; →</a></div><div className="feature"><div><div className="eyebrow">Featured collection</div><strong>Stories that stay.</strong></div></div></section>
 <section id="movies"><div className="section-head"><div><div className="eyebrow">The collection</div><h2>جدیدترین فیلم‌ها</h2></div><span className="eyebrow">Curated for you</span></div><div className="filters">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`filter ${cat===c?"active":""}`}>{({All:"همه",Drama:"درام",Mystery:"معمایی",Adventure:"ماجراجویی",Romance:"عاشقانه"})[c]}</button>)}</div><div className="grid">{shown.length?shown.map(m=><Link className="movie" href={`/movie/${m.id}`} key={m.id}><div className={`poster ${m.style}`}><small>★ {m.rating}</small><strong dir="rtl">{m.titleFa}</strong></div><div className="meta"><span>{m.year}</span><span>{({Drama:"درام",Mystery:"معمایی",Adventure:"ماجراجویی",Romance:"عاشقانه"})[m.cat]}</span></div><h3 dir="rtl">{m.titleFa}</h3></Link>):<p>فیلمی پیدا نشد.</p>}</div></section>
 <footer className="footer"><span>© 2026 Persian Movie</span><span>خانه‌ای برای داستان‌های ایرانی</span></footer></div>
 <div className={`drawer ${open?"open":""}`} onClick={()=>setOpen(false)}><div className="panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(false)} aria-label="بستن منو"><X/></button><div className="brand">Persian<b>Movie</b></div><nav><a href="#home" onClick={()=>setOpen(false)}>خانه</a><a href="#movies" onClick={()=>setOpen(false)}>فیلم‌ها</a><a href="#series" onClick={()=>setOpen(false)}>سریال‌ها</a><a href="#live" onClick={()=>setOpen(false)}>پخش زنده</a><a href="#about" onClick={()=>setOpen(false)}>درباره ما</a></nav></div></div></main>;
}
