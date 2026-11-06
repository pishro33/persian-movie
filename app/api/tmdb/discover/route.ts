import { NextResponse } from "next/server";

const genreNames: Record<number, string> = {
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  9648: "Mystery",
  53: "Thriller",
};

type TMDBMovie = {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  poster_path: string | null;
  genre_ids?: number[];
};

export async function GET(request: Request) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TMDB access token is not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const page = Math.min(500, Math.max(1, Number(url.searchParams.get("page")) || 1));
  const params = new URLSearchParams({
    include_adult: "false",
    include_video: "false",
    language: "fa-IR",
    page: String(page),
    sort_by: "release_date.desc",
    with_origin_country: "IR",
    with_original_language: "fa",
  });

  const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "TMDB discovery request failed" }, { status: response.status });
  }

  const data = await response.json() as {
    page: number;
    total_pages: number;
    results: TMDBMovie[];
  };

  const results = (data.results ?? []).map((movie) => ({
    id: `tmdb-${movie.id}`,
    tmdbId: movie.id,
    title: movie.original_title || movie.title,
    titleFa: movie.title,
    year: movie.release_date?.slice(0, 4) || "—",
    cat: (movie.genre_ids ?? []).map((id) => genreNames[id]).filter(Boolean).join(", ") || "Drama",
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
  }));

  return NextResponse.json({
    page: data.page,
    totalPages: data.total_pages,
    results,
  }, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
