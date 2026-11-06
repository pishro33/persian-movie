"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {Menu, X, ChevronLeft, ChevronRight} from "lucide-react";
const movies=[
 {id:"taxidermy",title:"Taxidermy",titleFa:"تاکسیدرمی",year:"2026",cat:"Comedy"},
 {id:"safar-be-limoonia",title:"Safar Be Limoonia",titleFa:"سفر به لیمونیا",year:"2026",cat:"Family"},
 {id:"lebas-shaksi",title:"Lebas Shaksi",titleFa:"لباس شخصی",year:"2026",cat:"Thriller"},
 {id:"harchi-to-begi",title:"Harchi to Begi",titleFa:"هرچی تو بگی",year:"2026",cat:"Comedy"},
 {id:"ghomarbaz",title:"Ghomarbaz",titleFa:"قمارباز",year:"2026",cat:"Mystery"},
 {id:"balit",title:"Balit",titleFa:"بالیت",year:"2026",cat:"Drama"},
 {id:"mashqe-emshab",title:"Mashqe emshab",titleFa:"مشق امشب",year:"2026",cat:"Documentary"},
 {id:"khab-nama",title:"Khab Nama",titleFa:"خواب‌نما",year:"2026",cat:"Comedy"},
 {id:"an-digari",title:"An Digari",titleFa:"آن دیگری",year:"2026",cat:"Drama"},
 {id:"antique",title:"Antique",titleFa:"آنتیک",year:"2026",cat:"Comedy"},
 {id:"ashe-khanoom-jan",title:"Ashe Khanoom Jan",titleFa:"عاشه خانوم جان",year:"2026",cat:"Comedy"},
 {id:"majarajooi-dar-jazire-jamesbond",title:"Majarajooi Dar Jazire Jamesbond",titleFa:"ماجراجویی در جزیره جیمزباند",year:"2026",cat:"Comedy"},
 {id:"mahoor",title:"Mahoor",titleFa:"ماهور",year:"2026",cat:"Drama"},
 {id:"khar-va-khak",title:"Khar va Khak",titleFa:"خر و خاک",year:"2026",cat:"Drama"},
 {id:"kamion",title:"Kamion",titleFa:"کامیون",year:"2026",cat:"Social"},
 {id:"rokh-nilo",title:"Rokh Nilo",titleFa:"رخ نیلو",year:"2026",cat:"Drama"},
 {id:"sar-riz-short-movie",title:"Sar-riz short movie",titleFa:"سرریز",year:"2026",cat:"Drama, Thriller"},
 {id:"almas",title:"Almas",titleFa:"الماس",year:"2026",cat:"Crime"},
 {id:"pepperoni-baraye-dictator",title:"Pepperoni baraye dictator",titleFa:"پپرونی برای دیکتاتور",year:"2026",cat:"Comedy"},
 {id:"zabet-movie",title:"Zabet Movie",titleFa:"ضابط",year:"2026",cat:"Social"},
 {id:"vahshi",title:"Vahshi",titleFa:"وحشی",year:"2026",cat:"Drama"},
 {id:"dokhtare-barqi",title:"Dokhtare Barqi",titleFa:"دختر برقی",year:"2026",cat:"Family"},
 {id:"shahre-doodi",title:"Shahre Doodi",titleFa:"شهر دودی",year:"2026",cat:"Social"},
 {id:"nekbat-theatre",title:"Nekbat Theatre",titleFa:"نکبت",year:"2026",cat:"Theatre"}
];
const cats=["All","Comedy","Drama","Family","Thriller","Mystery","Social","Crime","Documentary","Theatre"];
const catFa:Record<string,string>={Comedy:"کمدی",Drama:"درام",Family:"خانوادگی",Thriller:"هیجان‌انگیز",Mystery:"معمایی",Social:"اجتماعی",Crime:"جنایی",Documentary:"مستند",Theatre:"تئاتر"};
const pageSize=8;
type MovieItem = {id:string;title:string;titleFa:string;year:string;cat:string;poster?:string|null};
export default function Home(){
 const [cat,setCat]=useState("All"),[query,setQuery]=useState(""),[open,setOpen]=useState(false),[page,setPage]=useState(1);
 const [posters,setPosters]=useState<Record<string,string|null>>({});
 const [discovered,setDiscovered]=useState<MovieItem[]>([]);
 const [discoverPage,setDiscoverPage]=useState(1),[totalDiscoverPages,setTotalDiscoverPages]=useState(1),[loadingMore,setLoadingMore]=useState(false);
 useEffect(()=>{fetch("/api/tmdb/discover?page=1").then(r=>r.ok?r.json():null).then(data=>{if(data){setDiscovered(data.results??[]);setTotalDiscoverPages(data.totalPages??1);}}).catch(()=>{});},[]);
 const loadMore=async()=>{if(loadingMore||discoverPage>=totalDiscoverPages)return;setLoadingMore(true);try{const next=discoverPage+1;const r=await fetch(`/api/tmdb/discover?page=${next}`);if(r.ok){const data=await r.json();setDiscovered(prev=>[...prev,...(data.results??[])]);setDiscoverPage(next);setTotalDiscoverPages(data.totalPages??next);}}finally{setLoadingMore(false);}};
 useEffect(()=>{const ids=movies.map(m=>m.id).join(",");fetch(`/api/tmdb?ids=${encodeURIComponent(ids)}`).then(r=>r.ok?r.json():{}).then(data=>setPosters(data)).catch(()=>setPosters({}));},[]);
 const allMovies:MovieItem[]=[...movies,...discovered.filter(d=>!movies.some(m=>m.titleFa===d.titleFa))];
 const filtered=useMemo(()=>allMovies.filter(m=>(cat==="All"||m.cat.split(", ").includes(cat))&&(`${m.title} ${m.titleFa}`.toLowerCase().includes(query.toLowerCase()))),[cat,query,discovered]);
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
 const shown=filtered.slice((page-1)*pageSize,page*pageSize);
 const changeCat=(value:string)=>{setCat(value);setPage(1)};
 const changeQuery=(value:string)=>{setQuery(value);setPage(1)};
 return <main className="shell"><div className="wrap">
 <header className="header"><Link className="brand" href="/">Persian<b>Movie</b></Link><nav className="nav"><a href="#home">خانه</a><a href="#movies">فیلم‌ها</a><a href="#series">سریال‌ها</a><a href="#live">پخش زنده</a></nav><div className="actions"><input className="search" aria-label="جست‌وجو" placeholder="جست‌وجوی فیلم..." value={query} onChange={e=>changeQuery(e.target.value)}/><button className="menu" aria-label="باز کردن منو" onClick={()=>setOpen(true)}><Menu/></button></div></header>
 <section className="hero" id="home"><div dir="rtl" className="hero-copy"><div className="eyebrow">دنیایی از داستان‌ها · سینمای ایران</div><h1>داستان بعدیِ <span>موردعلاقه‌ات</span> را پیدا کن.</h1><p className="copy">فیلم‌ها و سریال‌های ایرانی را کشف کن، تازه‌ترین آثار را ببین و داستان‌های ماندگار سینمای ایران را دوباره تجربه کن.</p><a className="cta" href="#movies">تماشای فیلم‌ها&nbsp; ←</a></div><div className="feature"><div><div className="eyebrow">منتخب سردبیر</div><strong>داستان‌هایی که می‌مانند.</strong></div></div></section>
 <section id="movies"><div className="section-head"><div dir="rtl"><div className="eyebrow">آرشیو فیلم‌ها · صفحهٔ اول</div><h2>جدیدترین فیلم‌ها</h2></div><span className="eyebrow">آرشیو فیلم‌های ایرانی</span></div><div className="filters">{cats.map(c=><button key={c} onClick={()=>changeCat(c)} className={`filter ${cat===c?"active":""}`}>{c==="All"?"همه":catFa[c]}</button>)}</div><div className="grid">{shown.length?shown.map(m=><Link className="movie" href={`/movie/${m.id}`} key={m.id}><div className="poster" role="img" aria-label={`پوستر ${m.titleFa}`}>{(m.poster||posters[m.id])&&<img src={(m.poster||posters[m.id])??""} alt={`پوستر ${m.titleFa}`} loading="lazy" className="poster-image"/>}<strong dir="rtl">{m.titleFa}</strong>{!(m.poster||posters[m.id])&&<span className="poster-hint">پوستر فیلم</span>}</div><div className="meta" dir="rtl"><span>{m.year}</span><span>{m.cat.split(", ").map(g=>catFa[g]??g).join("، ")}</span></div></Link>):<p dir="rtl">فیلمی با این مشخصات پیدا نشد.</p>}</div>
 <div className="filters" style={{justifyContent:"center",alignItems:"center",marginTop:28}}><button className="filter" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronRight size={16}/> قبلی</button><span dir="rtl" className="eyebrow">صفحه {page} از {pages}</span><button className="filter" disabled={page===pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}>بعدی <ChevronLeft size={16}/></button></div><div className="filters" style={{justifyContent:"center",marginTop:18}}>{discoverPage<totalDiscoverPages&&<button className="filter" onClick={loadMore} disabled={loadingMore}>{loadingMore?"در حال دریافت...":"نمایش فیلم‌های بیشتر"}</button>}</div></section>
 <footer className="footer"><span>© ۲۰۲۶ Persian Movie</span><span>خانه‌ای برای داستان‌های ایرانی</span><div className="tmdb-credit" dir="rtl"><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">اطلاعات و تصاویر: TMDB</a><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div></footer></div>
 <div className={`drawer ${open?"open":""}`} onClick={()=>setOpen(false)}><div className="panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(false)} aria-label="بستن منو"><X/></button><div className="brand">Persian<b>Movie</b></div><nav><a href="#home" onClick={()=>setOpen(false)}>خانه</a><a href="#movies" onClick={()=>setOpen(false)}>فیلم‌ها</a><a href="#series" onClick={()=>setOpen(false)}>سریال‌ها</a><a href="#live" onClick={()=>setOpen(false)}>پخش زنده</a><a href="#about" onClick={()=>setOpen(false)}>درباره ما</a></nav></div></div></main>;
}
