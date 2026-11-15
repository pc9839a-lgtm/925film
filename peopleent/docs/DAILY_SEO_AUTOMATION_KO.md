# 피플엔트 SEO 콘텐츠 자동 발행 운영 명세
작성: 2026-11-15 / 대상: `pc9839a-lgtm/925film`의 `peopleent/`

## 배포 경계 — 반드시 먼저 확인
- 이 저장소에서 확인된 페이지 경로는 `/peopleent/`이며 현재 HTML canonical과 sitemap은 `https://925film.pages.dev/peopleent/`를 사용한다.
- `peopleent.com`은 별도의 아임웹 운영 사이트이며 이 저장소를 커밋해도 `peopleent.com`에 게시됐다고 단정하면 안 된다.
- `peopleent.pagero.kr`와 본 저장소의 배포 매핑은 아직 입증되지 않았다. 근거 없이 canonical을 바꾸거나 크로스도메인 sitemap을 제출하면 안 된다.
- 페이지의 실제 공개 200 응답과 최종 URL을 확인하기 전에는 '게시 완료'라고 보고하지 않는다. 기존 홈페이지의 SEO 메타·브랜드·문의 링크는 보존한다.

## 발행 등록 위치
- 콘텐츠 목록: `peopleent/insights/index.html`
- 본문 원본 및 배포 페이지: `peopleent/insights/<slug>/index.html`
- 콘텐츠 원장: `peopleent/insights/content-index.json`
- 공통 스타일: `peopleent/insights/guide.css`
- Sitemap: `peopleent/sitemap.xml`
- 빌드 품질 검사: `node peopleent/tools/validate-insights.mjs`
- CI: `.github/workflows/peopleent-seo-integrity.yml`

## 새 글 1건의 작업 순서
1. 저장소 최신 main과 원장, 본문 전체 제목·primary_query·intent를 조사한다. `peopleent.com` 기존 서비스 페이지와 검색 의도가 겹치지 않는지도 검사한다.
2. 후보 5개를 만들고 중복 없이 전환 의도가 뚜렷한 주제 1개만 고른다. 유사한 주제를 재발행하지 않는다.
3. 당일 웹 검색으로 공식·권위 있는 출처 확인. 법률·정책·규정·금액 등 확인되지 않는 내용은 추측하지 않는다.
4. 첫 문단에서 답을 제시하고, 원본 가치가 있는 표·실무 체크리스트·판단 방법을 작성한다. 가짜 수행 사례나 금액을 만들지 않는다. 예시는 가정이라고 명시한다.
5. 기존 글 3개 이상 내부링크를 우선 연결하되, 실제 관련 글이 적을 때는 다른 적합한 서비스 페이지로 연결하고 무의미한 링크를 추가하지 않는다.
6. `peopleent/insights/<slug>/index.html`을 기존 스타일에 맞춰 완성한다. 고유 meta title/description, H1 1개, self-canonical, OG, BlogPosting, BreadcrumbList, 정확한 발행일을 포함한다.
7. `content-index.json`, 목록 최신순, `sitemap.xml`을 갱신한다. 기존 글·sitemap 주소를 삭제하지 않는다.
8. `node peopleent/tools/validate-insights.mjs` 검사에 통과해야 한다. 검증 실패 시 발행 보류한다.
9. GitHub에 커밋하고 가능한 경우 PR과 검증 결과를 확인한다. 배포가 자동화되었다면 실제 운영 URL의 200·본문·canonical·목록 노출을 확인한다.
10. 성공할 경우 제목·키워드·URL·GitHub 커밋·라이브 확인 여부를 간결히 기록한다. 라이브 확인 실패 시 '소스 반영, 배포 미확인'으로 정확히 보고한다.

## 30일 편성 원칙
견적·행사발주 30%, 기업·공공기관 행사 실무 30%, 온라인 송출/기술 25%, 촬영·디자인 납품 15%.
사업 안내페이지와 겹치는 포괄적 '행사 대행 소개' 글 반복 금지.
글 1개의 검색 의도를 분리하고 충분한 실제 도움을 제공하는 글만 발행한다.
목표는 검증을 통과한 날 하루 1개다. 발행일을 맞추기 위해 미검증 글을 게시하지 않는다.

## 1차 발행 주제 목록
1. 기업행사 대행 견적서 비교 항목 — 작성 완료
2. 행사 운영대행 비용 구성 항목과 범위
3. 행사 대행업체와 장비업체 역할 비교
4. 공공기관 행사 발주 전 준비서류
5. 행사장 사전답사 체크리스트
6. 100인·300인 세미나 인력/동선 설계
7. 발표자 3명 이상일 때 리허설 운영표

## 성과
- 주 1회 Google Search Console의 실제 색인 URL, 노출·클릭·쿼리와 상담 전환 데이터를 확인한다.
- Search Console 연결/접근이 불가능할 때는 노출·색인 수를 임의로 보고하지 않는다.
- 검색 실적이 없는 경우 콘텐츠 양산만으로 해결됐다고 주장하지 말고 색인 상태, 내부링크, 사이트 소유·도메인 설정부터 점검한다.

## 배포 전 체크
- [ ] 새 글과 목록의 H1이 각 1개
- [ ] URL별 title/description 유일
- [ ] sitemap loc / canonical 정확히 일치
- [ ] 기존 사이트 홈페이지와 문의 링크 변동 없음
- [ ] 인용 자료/숫자/규정의 확인 날짜 표시
- [ ] 모바일에서 글과 표 가독성 유지
- [ ] 현재 GitHub commit 및 live URL 상태 분리 보고
