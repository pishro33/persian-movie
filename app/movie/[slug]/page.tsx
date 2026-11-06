"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";

type Movie = { title: string; year: string; genre: string };

const movies: Record<string, Movie> = {
  "taxidermy": { title: "تاکسیدرمی", year: "۲۰۲۶", genre: "کمدی" },
  "safar-be-limoonia": { title: "سفر به لیمونیا", year: "۲۰۲۶", genre: "خانوادگی" },
  "lebas-shaksi": { title: "لباس شخصی", year: "۲۰۲۶", genre: "هیجان‌انگیز" },
  "harchi-to-begi": { title: "هرچی تو بگی", year: "۲۰۲۶", genre: "کمدی" },
  "ghomarbaz": { title: "قمارباز", year: "۲۰۲۶", genre: "معمایی" },
  "balit": { title: "بالیت", year: "۲۰۲۶", genre: "درام" },
  "mashqe-emshab": { title: "مشق امشب", year: "۲۰۲۶", genre: "مستند" },
  "khab-nama": { title: "خواب‌نما", year: "۲۰۲۶", genre: "کمدی" },
  "an-digari": { title: "آن دیگری", year: "۲۰۲۶", genre: "درام" },
  "antique": { title: "آنتیک", year: "۲۰۲۶", genre: "کمدی" },
  "ashe-khanoom-jan": { title: "عاشه خانوم جان", year: "۲۰۲۶", genre: "کمدی" },
  "majarajooi-dar-jazire-jamesbond": { title: "ماجراجویی در جزیره جیمزباند", year: "۲۰۲۶", genre: "کمدی" },
  "mahoor": { title: "ماهور", year: "۲۰۲۶", genre: "درام" },
  "khar-va-khak": { title: "خر و خاک", year: "۲۰۲۶", genre: "درام" },
  "kamion": { title: "کامیون", year: "۲۰۲۶", genre: "اجتماعی" },
  "rokh-nilo": { title: "رخ نیلو", year: "۲۰۲۶", genre: "درام" },
  "sar-riz-short-movie": { title: "سرریز", year: "۲۰۲۶", genre: "درام، هیجان‌انگیز" },
  "almas": { title: "الماس", year: "۲۰۲۶", genre: "جنایی" },
  "pepperoni-baraye-dictator": { title: "پپرونی برای دیکتاتور", year: "۲۰۲۶", genre: "کمدی" },
  "zabet-movie": { title: "ضابط", year: "۲۰۲۶", genre: "اجتماعی" },
  "vahshi": { title: "وحشی", year: "۲۰۲۶", genre: "درام" },
  "dokhtare-barqi": { title: "دختر برقی", year: "۲۰۲۶", genre: "خانوادگی" },
  "shahre-doodi": { title: "شهر دودی", year: "۲۰۲۶", genre: "اجتماعی" },
  "nekbat-theatre": { title: "نکبت", year: "۲۰۲۶", genre: "تئاتر" },
};

export default function MoviePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const movie = movies[slug];
  const [poster, setPoster] = useState<string | null>(null);

  useEffect(() => {
    if (!movie) return;
    fetch(`/api/tmdb?ids=${encodeURIComponent(slug)}`)
      .then((response) => response.ok ? response.json() : {})
      .then((data: Record<string, string | null>) => setPoster(data[slug] ?? null))
      .catch(() => setPoster(null));
  }, [slug, movie]);

  if (!movie) {
    return <main className="shell"><div className="wrap" style={{ padding: "70px 0" }}><p dir="rtl">این عنوان پیدا نشد.</p><Link href="/" className="cta">بازگشت به فیلم‌ها</Link></div></main>;
  }

  return (
    <main className="shell">
      <div className="wrap">
        <header className="header">
          <Link className="brand" href="/">Persian<b>Movie</b></Link>
          <Link href="/" className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 7 }}><ArrowLeft size={14} /> بازگشت</Link>
        </header>

        <section dir="rtl" style={{ padding: "42px 0 28px" }}>
          <div className="eyebrow">جزئیات فیلم · سینمای ایران</div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 54px)", margin: "14px 0" }}>{movie.title}</h1>
          <p className="copy">{movie.year}　·　{movie.genre}</p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)", gap: 28, alignItems: "center", paddingBottom: 36 }}>
          <div style={{ width: "100%", maxWidth: 280, aspectRatio: "2 / 3", borderRadius: 18, overflow: "hidden", position: "relative", background: "linear-gradient(145deg,#304b70,#916d83 60%,#d4a17b)", border: "1px solid var(--line)" }}>
            {poster ? <img src={poster} alt={`پوستر ${movie.title}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="poster-hint">پوستر فیلم</span>}
          </div>
          <div dir="rtl" style={{ minHeight: 220, border: "1px solid var(--line)", borderRadius: 20, background: "#030711", display: "grid", placeItems: "center", textAlign: "center", padding: 25 }}>
            <div>
              <div style={{ fontSize: 38, color: "var(--accent)", display: "flex", justifyContent: "center" }}><Play /></div>
              <h2>پخش فیلم</h2>
              <p className="copy">پخش‌کننده هنوز متصل نشده است. در این بخش فقط محتوای دارای مجوز پخش قرار می‌گیرد.</p>
            </div>
          </div>
        </section>
        <div style={{ padding: "0 0 65px" }}><Link href="/#movies" className="cta">دیدن فیلم‌های بیشتر</Link></div>
        <footer className="footer">© ۲۰۲۶ Persian Movie</footer>
      </div>
      <style jsx>{`@media(max-width:640px){section[style*="grid-template-columns"]{grid-template-columns:1fr!important}section[style*="grid-template-columns"]>div:first-child{max-width:220px;margin:0 auto}}`}</style>
    </main>
  );
}
