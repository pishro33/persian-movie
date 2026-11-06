import { NextResponse } from "next/server";

type TMDBShow = {
  id: number;
  name: string;
  original_name: string;
  first_air_date?: string;
  poster_path: string | null;
  genre_ids?: number[];
};

const genreNames: Record<number, string> = {
  18: "Drama",
  35: "Comedy",
  80: "Crime",
  9648: "Mystery",
  10765: "Sci-Fi & Fantasy",
  10751: "Family",
  10759: "Action & Adventure",
  99: "Documentary",
};

export async function GET(request: Request) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: "TMDB access token is not configured" }, { status: 503 });

  const url = new URL(request.url);
  const page = Math.min(500, Math.max(1, Number(url.searchParams.get("page")) || 1));
  const params = new URLSearchParams({
    include_adult: "false",
    language: "fa-IR",
    page: String(page),
    sort_by: "first_air_date.desc",
    with_origin_country: "IR",
    with_original_language: "fa",
  });

  const response = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return NextResponse.json({ error: "TMDB TV discovery request failed" }, { status: response.status });

  const data = await response.json() as { page: number; total_pages: number; results: TMDBShow[] };
  return NextResponse.json({
    page: data.page,
    totalPages: data.total_pages,
    results: (data.results ?? []).map((show) => ({
      id: `tmdb-tv-${show.id}`,
      tmdbId: show.id,
      title: show.original_name || show.name,
      titleFa: show.name,
      year: show.first_air_date?.slice(0, 4) || "—",
      cat: (show.genre_ids ?? []).map((id) => genreNames[id]).filter(Boolean).join(", ") || "Drama",
      poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
    })),
  }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
