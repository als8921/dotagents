# dotagents

Claude Code · Codex · opencode 가 공유하는 개인 스킬·플러그인 모음.
직접 만든 스킬은 `skills/` 에 파일로 담고, 남이 만든 것은 카탈로그에 **주소만** 적는다
(설치 시점에 원본에서 받아오므로 재배포가 아니고 업스트림 갱신을 그대로 따라간다).

## 무엇이 들어 있나

**자작 스킬** — 아직 없음

**카탈로그**

| 플러그인 | 제공하는 것 | 출처 |
|---|---|---|
| `superpowers` | 스킬 14 — 브레인스토밍, TDD, 체계적 디버깅, 플랜 작성·실행, 코드리뷰, worktree, 병렬 에이전트 | [obra/superpowers](https://github.com/obra/superpowers) |
| `diagram-design` | 스킬 6 — 39종 다이어그램 생성(HTML/SVG), drawio·mermaid 임포트, 내보내기 | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) |
| `claude-hud` | 커맨드 2 — 상태줄 HUD 설정 | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) |

카탈로그 참조는 **Claude Code 에서만** 동작한다. Codex 와 opencode 에는 참조 개념이 없어
자작 스킬만 퍼지고, 남의 플러그인은 각자 설치한다.

**담지 않는 것**

- 정의가 상위 마켓플레이스에만 있는 플러그인 (`clangd-lsp`, `document-skills`) — 각자 원래 마켓플레이스에서 설치한다
- 서드파티 스킬 (archify, hallmark, find-skills 등) — `~/.agents/skills/` 에 두고 `npx skills` 로 갱신받는다.
  Codex·opencode 는 이 경로를 네이티브로 읽고, Claude Code 만 심링크가 필요하다

## 설치

```bash
# Claude Code
claude plugin marketplace add als8921/dotagents
claude plugin install dotagents@dotagents        # 자작 스킬
claude plugin install superpowers@dotagents      # 필요한 것만 골라서

# Codex
codex plugin marketplace add als8921/dotagents
codex plugin add dotagents@dotagents
```

opencode 는 `~/.config/opencode/opencode.json` 에 한 줄:

```json
{ "plugin": ["dotagents@git+https://github.com/als8921/dotagents.git"] }
```

> `@git+https://...` 까지 붙일 것. npm 에 동명의 무관한 패키지가 있어 bare name 은 그쪽이 받아진다.

## 갱신

**자동 갱신은 없다.** 카탈로그 목록은 자동으로 최신화되지만 설치된 플러그인 본체는 직접 갱신한다.

```bash
claude plugin update <이름>                  # 적용하려면 재시작
codex plugin marketplace upgrade dotagents
```

## 관리

```
skills/<이름>/SKILL.md              자작 스킬 본문
.claude-plugin/marketplace.json    Claude Code — 자작 + 카탈로그
.agents/plugins/marketplace.json   Codex
.codex-plugin/plugin.json          Codex 플러그인 본체
package.json + .opencode/plugins/  opencode (skills.paths 주입)
```

**스킬 추가** — `skills/<이름>/SKILL.md` 작성(frontmatter 에 `name`, `description` 필수)
→ `.claude-plugin/marketplace.json` 의 `dotagents` 엔트리 `skills` 배열에 경로 추가
→ 위 표에 한 줄 추가 → `claude plugin validate .` → push

**카탈로그 추가** — 넣기 전에 자립형인지 확인한다. `200` 이면 주소만 적으면 되고,
`404` 면 정의가 상위에 있으니 엔트리를 통째로 베껴 오거나 넣지 않는다.

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://raw.githubusercontent.com/<owner>/<repo>/main/.claude-plugin/plugin.json
```
