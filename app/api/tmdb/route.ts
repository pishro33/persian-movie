import { NextResponse } from "next/server";

const titles: Record<string, string> = {
  "taxidermy": "تاکسیدرمی",
  "safar-be-limoonia": "سفر به لیمونیا",
  "lebas-shaksi": "لباس شخصی",
  "harchi-to-begi": "هرچی تو بگی",
  "ghomarbaz": "قمارباز",
  "balit": "بالیت",
  "mashqe-emshab": "مشق امشب",
  "khab-nama": "خواب‌نما",
  "an-digari": "آن دیگری",
  "antique": "آنتیک",
  "ashe-khanoom-jan": "عاشه خانوم جان",
  "majarajooi-dar-jazire-jamesbond": "ماجراجویی در جزیره جیمزباند",
  "mahoor": "ماهور",
  "khar-va-khak": "خر و خاک",
  "kamion": "کامیون",
  "rokh-nilo": "رخ نیلو",
  "sar-riz-short-movie": "سرریز",
  "almas": "الماس",
  "pepperoni-baraye-dictator": "پپرونی برای دیکتاتور",
  "zabet-movie": "ضابط",
  "vahshi": "وحشی",
  "dokhtare-barqi": "دختر برقی",
  "shahre-doodi": "شهر دودی",
  "nekbat-theatre": "نکبت",
};

type SearchResult = { poster_path: string | null; title: string; original_title: string; release_date: string };

export async function GET(request: Request) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TMDB_ACCESS_TOKEN is not configured" }, { status: 503 });
  }

  const requested = new URL(request.url).searchParams.get("ids")?.split(",") ?? [];
  const ids = [...new Set(requested)].filter((id) => Object.hasOwn(titles, id)).slice(0, 24);

  const entries = await Promise.all(ids.map(async (slug) => {
    const query = new URLSearchParams({ query: titles[slug], language: "fa-IR", include_adult: "false" });
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?${query}`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) return [slug, null] as const;
    const data = await response.json() as { results?: SearchResult[] };
    const result = data.results?.find((item) => item.poster_path) ?? null;
    return [slug, result?.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : null] as const;
  }));

  return NextResponse.json(Object.fromEntries(entries), {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
