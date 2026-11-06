import { NextResponse } from "next/server";

const movies: Record<string, { fa: string; en: string }> = {
  "taxidermy": { fa: "تاکسیدرمی", en: "Taxidermy" },
  "safar-be-limoonia": { fa: "سفر به لیمونیا", en: "Safar Be Limoonia" },
  "lebas-shaksi": { fa: "لباس شخصی", en: "Lebas Shaksi" },
  "harchi-to-begi": { fa: "هرچی تو بگی", en: "Harchi To Begi" },
  "ghomarbaz": { fa: "قمارباز", en: "Ghomarbaz" },
  "balit": { fa: "بالیت", en: "Balit" },
  "mashqe-emshab": { fa: "مشق امشب", en: "Mashqe Emshab" },
  "khab-nama": { fa: "خواب‌نما", en: "Khab Nama" },
  "an-digari": { fa: "آن دیگری", en: "An Digari" },
  "antique": { fa: "آنتیک", en: "Antique" },
  "ashe-khanoom-jan": { fa: "عاشه خانوم جان", en: "Ashe Khanoom Jan" },
  "majarajooi-dar-jazire-jamesbond": { fa: "ماجراجویی در جزیره جیمزباند", en: "Majarajooi Dar Jazire Jamesbond" },
  "mahoor": { fa: "ماهور", en: "Mahoor" },
  "khar-va-khak": { fa: "خر و خاک", en: "Khar Va Khak" },
  "kamion": { fa: "کامیون", en: "Kamion" },
  "rokh-nilo": { fa: "رخ نیلو", en: "Rokh Nilo" },
  "sar-riz-short-movie": { fa: "سرریز", en: "Sar-riz" },
  "almas": { fa: "الماس", en: "Almas" },
  "pepperoni-baraye-dictator": { fa: "پپرونی برای دیکتاتور", en: "Pepperoni Baraye Dictator" },
  "zabet-movie": { fa: "ضابط", en: "Zabet" },
  "vahshi": { fa: "وحشی", en: "Vahshi" },
  "dokhtare-barqi": { fa: "دختر برقی", en: "Dokhtare Barqi" },
  "shahre-doodi": { fa: "شهر دودی", en: "Shahre Doodi" },
  "nekbat-theatre": { fa: "نکبت", en: "Nekbat" },
};

type SearchResult = { poster_path: string | null; title: string; original_title: string };

async function findPoster(queryText: string, language: string, token: string) {
  const params = new URLSearchParams({ query: queryText, language, include_adult: "false" });
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return null;
  const data = await response.json() as { results?: SearchResult[] };
  const results = data.results ?? [];
  const normalized = queryText.toLocaleLowerCase();
  const exact = results.find((item) =>
    item.poster_path &&
    [item.title, item.original_title].some((name) => name?.toLocaleLowerCase() === normalized)
  );
  return exact?.poster_path ?? results.find((item => item.poster_path))?.poster_path ?? null;
}

export async function GET(request: Request) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: "TMDB_ACCESS_TOKEN is not configured" }, { status: 503 });

  const requested = new URL(request.url).searchParams.get("ids")?.split(",") ?? [];
  const ids = [...new Set(requested)].filter((id) => Object.hasOwn(movies, id)).slice(0, 24);

  const entries = await Promise.all(ids.map(async (slug) => {
    const movie = movies[slug];
    let poster = await findPoster(movie.en, "en-US", token);
    if (!poster) poster = await findPoster(movie.fa, "fa-IR", token);
    return [slug, poster ? `https://image.tmdb.org/t/p/w500${poster}` : null] as const;
  }));

  return NextResponse.json(Object.fromEntries(entries), {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
