import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the My한경 관심종목 experience", async () => {
  const response = await render("/watchlist");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /<title>관심종목 \| My한경<\/title>/i);
  assert.match(html, /타임 브리핑/);
  assert.match(html, /종목추가/);
  assert.match(html, /관련기사/);
  assert.match(html, /리포트/);
  assert.match(html, /report-grid/);
  assert.match(html, /리포트 더보기/);
  assert.equal((html.match(/module-collapse-button/g) ?? []).length, 4);
  assert.doesNotMatch(html, /content-tabs/);
  assert.doesNotMatch(html, /오늘의 관심 브리핑/);
  assert.match(html, /sentiment-긍정[^>]*>긍정<\/span>/);
  assert.doesNotMatch(html, /AI 기사 분석/);
  assert.match(html, /고가/);
  assert.match(html, /저가/);
  assert.match(html, /삼성바이오로직스/);
  assert.match(html, /stock-remove-button/);
  assert.doesNotMatch(html, /<tr[^>]*tabindex=/i);
  assert.doesNotMatch(html, /stock-list-more/);
  assert.doesNotMatch(html, /MY INVESTMENT/);
  assert.doesNotMatch(html, /시세는 프로토타입용 예시 데이터입니다/);
  assert.doesNotMatch(html, /전체 그룹의 중복 종목을 제외한 오늘 등락률 기준/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("keeps the My한경 dashboard at the root URL", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>My한경<\/title>/i);
  assert.match(html, /보유 배지/);
  assert.match(html, /뉴스 스크랩/);
  assert.match(html, /관심 기자/);
  assert.doesNotMatch(html, /타임 브리핑/);
});

test("server-renders the My한경 최근 본 기사 experience", async () => {
  const response = await render("/recent-articles");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>최근 본 기사 \| My한경<\/title>/i);
  assert.match(html, /읽기 통계/);
  assert.match(html, /많이 읽은 분야/);
  assert.match(html, /관심 있게 본 기자/);
  assert.match(html, /AI 읽기 흐름 분석/);
  assert.match(html, /다방면 탐색형/);
  assert.match(html, /최근 본 기사 내역/);
  assert.equal((html.match(/recent-article-item/g) ?? []).length, 20);
  assert.equal((html.match(/reading-donut-segment /g) ?? []).length, 7);
  assert.equal((html.match(/reading-time-column/g) ?? []).length, 6);
  assert.match(html, /읽은 시간대/);
  assert.match(html, /더보기/);
  assert.match(html, /최근 3개월/);
  assert.match(html, /recent-delete-button/);
  assert.doesNotMatch(html, /MY CONTENT|매일 갱신|32\/30건|lucide-trash-2/);
  assert.doesNotMatch(html, /증권부|마켓인사이트|산업부|경제부|국제부|5명|lucide-chevron-right/);
});

test("keeps the My한경 dashboard modules in the requested order", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const dashboardSource = source.slice(source.indexOf("function Dashboard("), source.indexOf("function CollapseButton("));
  const badgeIndex = dashboardSource.indexOf("보유 배지");
  const scrapIndex = dashboardSource.indexOf("뉴스 스크랩");
  const watchlistIndex = dashboardSource.indexOf("<h2>관심종목</h2>");
  const reporterIndex = dashboardSource.indexOf("관심 기자");

  assert.ok(badgeIndex >= 0);
  assert.ok(badgeIndex < scrapIndex);
  assert.ok(scrapIndex < watchlistIndex);
  assert.ok(watchlistIndex < reporterIndex);
  assert.match(dashboardSource, /DASHBOARD_BADGES\.map/);
  assert.doesNotMatch(dashboardSource, /보유 배지 전체보기/);
  assert.match(styles, /\.dashboard-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(styles, /\.dashboard-watch-card\s*\{[^}]*grid-column:\s*auto;/s);
  assert.match(styles, /\.module-collapse-button\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;/s);
});
