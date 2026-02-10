"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import PRList from "../components/PRList";
import Pagination from "../components/Pagination";

export default function Home() {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState("vercel/next.js");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [isCached, setIsCached] = useState(false);

  const fetchPRs = async () => {
    setLoading(true);
    const [owner, repoName] = repo.split("/");
    try {
      const res = await fetch(
        `/api/prs?owner=${owner}&repo=${repoName}&page=${page}&perPage=${perPage}`,
      );
      const json = await res.json();
      setPrs(json.data || []);
      setIsCached(json.fromCache);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs();
  }, [page, perPage]);

  return (
    <main className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Header
        repo={repo}
        setRepo={setRepo}
        onSearch={() => {
          setPage(1);
          fetchPRs();
        }}
        perPage={perPage}
        setPerPage={setPerPage}
      />

      <section className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <PRList prs={prs} loading={loading} />
        </div>
      </section>

      <Pagination
        page={page}
        setPage={setPage}
        hasMore={prs.length >= perPage}
        loading={loading}
        count={prs.length}
        isCached={isCached}
      />
    </main>
  );
}
