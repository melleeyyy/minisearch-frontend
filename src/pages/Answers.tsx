import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import AnswerCard from "../components/AnswerCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getAnswer, type AnswerResponse } from "../services/answerApi";
import { ApiError } from "../services/api";
import { useSearchHistory } from "../hooks/useSearchHistory";

export default function Answers() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [data, setData] = useState<AnswerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const { add: addToHistory } = useSearchHistory();

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    if (!q) {
      setData(null);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    getAnswer(q)
      .then((res) => {
        if (!alive) return;
        setData(res);
        addToHistory(q);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setError(err instanceof ApiError ? err.message : "Unexpected error.");
        setData(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [q, nonce, addToHistory]);

  const submit = useCallback(
    (query: string) => setParams({ q: query }),
    [setParams]
  );

  return (
    <div>
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-row">
            <Logo size="sm" linked />
            <SearchBar
              value={input}
              onChange={setInput}
              onSubmit={submit}
              size="sm"
              placeholder="Ask a question..."
            />
          </div>
          <SearchTabs q={q} active="answers" />
        </div>
      </header>

      <div className="container">
        {!q && (
          <EmptyState
            title="Ask MiniSearch"
            message="Answers are extracted word-for-word from indexed pages, with citations — no AI generation. Try: What is Kerala? or കേരളം എന്നാൽ എന്ത്?"
          />
        )}
        {q && loading && <Loading label="Finding an answer..." />}
        {q && !loading && error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {q && !loading && !error && data && data.ok && data.answer && (
          <AnswerCard data={data} />
        )}
        {q && !loading && !error && data && (!data.ok || !data.answer) && (
          <EmptyState
            title="Not enough evidence"
            message={`MiniSearch could not find a reliable answer to “${q}” in its indexed pages. Try rephrasing the question, or search the Web tab for related pages.`}
          />
        )}
      </div>
    </div>
  );
}
