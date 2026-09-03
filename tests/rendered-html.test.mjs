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
  assert.match(html, /class="module-title-link" href="https:\/\/markets\.hankyung\.com\/consensus"/);
  assert.equal((html.match(/class="article-card"/g) ?? []).length, 10);
  assert.equal((html.match(/article-analysis-summary"/g) ?? []).length, 0);
  assert.ok((html.match(/class="article-analysis-row"/g) ?? []).length >= 10);
  assert.match(html, /AI 포인트뷰/);
  assert.match(html, /article-analysis-toggle-active/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-label="긍정 분석"/);
  assert.match(html, /🙂/);
  assert.match(html, /😐/);
  assert.match(html, /😞/);
  assert.doesNotMatch(html, /관련기사 종목 선택/);
  assert.doesNotMatch(html, /미국 반도체주가 일제히 급등하면서/);
  assert.doesNotMatch(html, /리포트 종목 선택|리포트 더보기|report-list|consensus-more-button/);
  assert.equal((html.match(/module-collapse-button/g) ?? []).length, 4);
  assert.doesNotMatch(html, /content-tabs/);
  assert.doesNotMatch(html, /오늘의 관심 브리핑/);
  assert.doesNotMatch(html, /AI 기사 분석/);
  assert.match(html, /고가/);
  assert.match(html, /저가/);
  assert.match(html, /삼성바이오로직스/);
  assert.equal((html.match(/nav-item-dot/g) ?? []).length, 3);
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
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(html, /<title>My한경<\/title>/i);
  assert.match(html, /My 브리핑/);
  assert.match(html, /미국 증시/);
  assert.match(html, /2026년 8월 18일 오전 브리핑입니다/);
  assert.match(html, /dashboard-recent-heading-link/);
  assert.match(html, /최근 본 기사<\/h2><span>23(?:<!-- -->)?건<\/span>/);
  assert.match(html, /나의 읽기 유형/);
  assert.match(html, /7(?:<!-- -->)?건 더 읽으면 알 수 있어요/);
  assert.match(source, /건 더 읽으면 알 수 있어요/);
  assert.match(html, /많이 본 분야/);
  assert.match(html, /dashboard-mini-donut/);
  assert.match(html, /증권/);
  assert.match(html, /54(?:<!-- -->)?%/);
  assert.equal((html.match(/dashboard-recent-item/g) ?? []).length, 6);
  assert.match(html, /2026\.08\.18 09:29/);
  assert.match(html, /보유 배지/);
  assert.match(html, /보유 배지<\/h2><span>8개<\/span>/);
  assert.match(html, /뉴스 스크랩/);
  assert.match(html, /반도체 수출 다시 최고치…하반기 전망은<\/strong><small>2026\.08\.18 09:29<\/small>/);
  assert.doesNotMatch(html, /오늘 11:20|어제 18:42|>8월 1일</);
  assert.match(html, /관심 기자/);
  assert.equal((html.match(/dashboard-badge-item/g) ?? []).length, 6);
  assert.equal((html.match(/dashboard-badge-emblem-image/g) ?? []).length, 6);
  assert.equal((html.match(/nav-item-dot/g) ?? []).length, 3);
  assert.match(html, /href="\/badges\?badge=/);
  assert.match(html, /class="title-with-icon dashboard-recent-heading-link" href="\/recent-articles"/);
  assert.match(html, /aria-label="최근 본 기사 전체보기"/);
  assert.doesNotMatch(html, /dashboard-heading|안녕하세요, 오늘의 관심 흐름을 정리했어요|MY HANKYUNG/);
  assert.doesNotMatch(html, /타임 브리핑/);
});

test("server-renders the My한경 badge collection", async () => {
  const response = await render("/badges");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>배지 \| My한경<\/title>/i);
  assert.match(html, /프리미엄9 라운지/);
  assert.match(html, /월컴 스타터/);
  assert.match(html, /한경 탐험가/);
  assert.match(html, /한경 헤리티지/);
  assert.match(html, /히든 배지/);
  assert.match(html, /미획득/);
  assert.match(html, /배지 그룹 필터/);
  assert.match(html, /전체<em>8(?:<!-- -->)?\/(?:<!-- -->)?40<\/em>/);
  assert.equal((html.match(/class="badge-card /g) ?? []).length, 40);
  assert.match(html, /프리미엄9 라운지<em>1(?:<!-- -->)?\/(?:<!-- -->)?7<\/em>/);
  assert.match(html, /월컴 스타터<em>7(?:<!-- -->)?\/(?:<!-- -->)?10<\/em>/);
  assert.equal((html.match(/nav-item-dot/g) ?? []).length, 3);
  assert.doesNotMatch(html, /배지 획득 상태 필터|badge-status-select-wrap/);
  assert.doesNotMatch(html, /획득한 배지|badge-summary-compact|badge-card-progress|badge-detail-progress/);
  assert.equal((html.match(/badge-emblem-mystery/g) ?? []).length, 3);
  assert.equal((html.match(/badge-emblem-shape-premium/g) ?? []).length, 6);
  assert.equal((html.match(/badge-emblem-shape-welcome/g) ?? []).length, 3);
  assert.equal((html.match(/badge-emblem-shape-explorer/g) ?? []).length, 12);
  assert.equal((html.match(/badge-emblem-shape-heritage/g) ?? []).length, 8);
  for (const imageName of ["hankyung-prestige", "hankyung-member", "feedback-place", "alice-invite", "this-is-me", "my-newsroom", "first-conversation", "share-good"]) {
    assert.match(html, new RegExp(`/badges/${imageName}\\.png`));
  }
  assert.doesNotMatch(html, /생일파티 손님|끝을 보는 성격|권리의 수호자/);
  assert.doesNotMatch(html, /최근 획득|배지 획득 조건을 완료했습니다|badge-detail-action/);
});

test("keeps acquired badge messages separate from earning hints", async () => {
  const source = await readFile(new URL("../app/badges/badges-client.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.equal((source.match(/earnedMessage:/g) ?? []).length, 10);
  assert.match(source, /ALICE Q의 첫 번째 게임을 클리어하셨습니다/);
  assert.match(source, /한국경제신문의 소중한 회원이 되신 것을 진심으로 환영합니다/);
  assert.match(source, /name: "알림은 못 참지"/);
  assert.match(source, /selectedBadge\.earnedMessage \?\?/);
  assert.match(styles, /\.badge-emblem-mystery\s*\{[^}]*border:\s*0;/s);
  assert.match(styles, /\.badge-emblem-locked-shape\s*\{[^}]*border:\s*0;/s);
});

test("server-renders the My한경 최근 본 기사 experience", async () => {
  const response = await render("/recent-articles");
  assert.equal(response.status, 200);
  const html = await response.text();
  const source = await readFile(new URL("../app/recent-articles/recent-articles-client.tsx", import.meta.url), "utf8");

  assert.match(html, /<title>최근 본 기사 \| My한경<\/title>/i);
  assert.match(html, /기사 열람 분야/);
  assert.doesNotMatch(html, /관심 있게 본 기자/);
  assert.match(html, /AI 읽기 흐름 분석/);
  assert.match(html, /여우형 독자/);
  assert.match(html, /reading-fox\.png/);
  assert.doesNotMatch(html, /주요 관심사/);
  assert.match(html, /기사 열람 시간/);
  assert.match(html, /기사 열람 내역/);
  assert.match(html, /class="category-share">29(?:<!-- -->)?%/);
  assert.equal((html.match(/34(?:<!-- -->)?건/g) ?? []).length, 2);
  assert.match(source, /active\.count\}건 · \{Math\.round/);
  assert.match(html, /최근 3개월간 읽은 기사와 나의 뉴스 소비 패턴을 확인해보세요\./);
  assert.doesNotMatch(html, /최근 3개월의 기사 기록과 나의 읽기 흐름을 확인해보세요\./);
  assert.equal((html.match(/recent-article-item/g) ?? []).length, 20);
  assert.equal((html.match(/reading-donut-segment /g) ?? []).length, 6);
  assert.equal((html.match(/reading-time-column/g) ?? []).length, 6);
  assert.equal((html.match(/reading-time-clock/g) ?? []).length, 6);
  assert.doesNotMatch(html, />4시간 단위</);
  assert.doesNotMatch(html, /읽기 통계|많이 읽은 분야|읽은 시간대/);
  assert.match(html, /22~02/);
  assert.match(html, /18~22/);
  assert.match(html, /취침 전 타임 \(올빼미 독자\)/);
  assert.doesNotMatch(html, /00~04|20~24/);
  assert.match(html, /더보기/);
  assert.match(html, /최근 3개월/);
  assert.match(html, /recent-delete-button/);
  assert.equal((html.match(/nav-item-dot/g) ?? []).length, 3);
  assert.doesNotMatch(html, /MY CONTENT|매일 갱신|매일 자정 업데이트|2026\.08\.06 분석|32\/30건|lucide-trash-2/);
  assert.doesNotMatch(html, /증권부|마켓인사이트|산업부|경제부|국제부|5명|lucide-chevron-right/);
  assert.doesNotMatch(html, />[^<]+ 기자<\/small>/);
  assert.doesNotMatch(html, /최근 열람/);
  assert.doesNotMatch(source, /viewedAt|<span>\{article\.section\}<\/span>/);
  assert.ok(html.indexOf("AI 읽기 흐름 분석") < html.indexOf("기사 열람 분야"));
  assert.match(source, /useState<string \| null>\(null\)/);
  assert.match(source, /onMouseLeave=\{\(\) => setActiveName\(null\)\}/);

  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /@keyframes fox-reading-float/);
  assert.match(styles, /animation:\s*fox-reading-float 4\.8s ease-in-out infinite/);
  assert.match(styles, /@media \(max-width: 1120px\)\s*\{\s*\.reading-insights-grid\s*\{\s*grid-template-columns:\s*1fr;/s);
  assert.doesNotMatch(styles, /\.top-category-list[^{}]*\{[^}]*display:\s*none/s);
});

test("keeps the My한경 dashboard modules in the requested order", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const dashboardSource = source.slice(source.indexOf("function Dashboard("), source.indexOf("function CollapseButton("));
  const briefingIndex = dashboardSource.indexOf("<h2>My 브리핑</h2>");
  const recentIndex = dashboardSource.indexOf("<h2>최근 본 기사</h2>");
  const badgeIndex = dashboardSource.indexOf("보유 배지");
  const scrapIndex = dashboardSource.indexOf("뉴스 스크랩");
  const watchlistIndex = dashboardSource.indexOf("<h2>관심종목</h2>");
  const reporterIndex = dashboardSource.indexOf("관심 기자");

  assert.ok(briefingIndex >= 0);
  assert.ok(briefingIndex < recentIndex);
  assert.ok(recentIndex < badgeIndex);
  assert.ok(badgeIndex < scrapIndex);
  assert.ok(scrapIndex < watchlistIndex);
  assert.ok(watchlistIndex < reporterIndex);
  assert.match(dashboardSource, /DASHBOARD_BADGES\.map/);
  assert.match(dashboardSource, /onClick=\{onOpenRecent\}/);
  assert.match(dashboardSource, /DASHBOARD_RECENT_ARTICLES\.map/);
  assert.match(dashboardSource, /dashboard-recent-stats/);
  assert.match(styles, /\.dashboard-recent-item strong\s*\{[^}]*text-overflow:\s*ellipsis;[^}]*white-space:\s*nowrap;/s);
  assert.match(styles, /\.dashboard-recent-heading-link\s*\{[^}]*text-decoration:\s*none;/s);
  assert.doesNotMatch(styles, /\.dashboard-heading(?:\s|,|\{)/);
  assert.doesNotMatch(dashboardSource, />보유 배지 전체보기</);
  assert.match(styles, /\.dashboard-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(styles, /\.dashboard-watch-card\s*\{[^}]*grid-column:\s*auto;/s);
  assert.match(styles, /\.module-collapse-button\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;/s);
});
