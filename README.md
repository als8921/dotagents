# dotagents

내가 쓰는 Claude Code 스킬·플러그인 모음. 마켓플레이스 하나로 등록해두고
새 머신에서 바로 꺼내 쓴다.

담는 방법은 두 가지다.

- **파일로** — 직접 만든 스킬. 원본이 여기밖에 없으니 `skills/` 에 실제 파일을 둔다.
- **주소로** — 남이 만든 플러그인. 파일을 복사하지 않고 출처만 적는다. 설치 시점에
  원본에서 받아오므로 재배포가 아니고, 업스트림 갱신을 그대로 따라간다.

## 무엇이 들어 있나

**자작 스킬** — 아직 없음

**카탈로그**

| 플러그인 | 제공하는 것 | 출처 |
|---|---|---|
| `superpowers` | 스킬 14 — 브레인스토밍, TDD, 체계적 디버깅, 플랜 작성·실행, 코드리뷰, worktree, 병렬 에이전트 | [obra/superpowers](https://github.com/obra/superpowers) |
| `diagram-design` | 스킬 6 — 39종 다이어그램 생성(HTML/SVG), drawio·mermaid 임포트, 내보내기 | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) |
| `ponytail` | 훅 3 — 세션·서브에이전트·프롬프트마다 "가장 단순한 해법" 지침을 주입 | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) |
| `claude-hud` | 커맨드 2 — 상태줄 HUD 설정 | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) |

**담지 않는 것** — 정의가 상위 마켓플레이스에만 있는 플러그인 (`clangd-lsp`,
`document-skills`). 주소만 참조하면 껍데기가 깔리므로 각자 원래 마켓플레이스에서 설치한다.

## 설치

```bash
claude plugin marketplace add als8921/dotagents
claude plugin install dotagents@dotagents        # 자작 스킬
claude plugin install superpowers@dotagents      # 필요한 것만 골라서
claude plugin install diagram-design@dotagents
```

## 갱신

**자동 갱신은 없다.** 카탈로그 목록은 자동으로 최신화되지만 설치된 플러그인 본체는
직접 갱신한다. 적용하려면 Claude Code 재시작이 필요하다.

```bash
claude plugin marketplace update dotagents
claude plugin update <이름>
```

## 관리

```
skills/<이름>/SKILL.md              자작 스킬 본문
.claude-plugin/marketplace.json    자작 엔트리 + 카탈로그
```

**스킬 추가** — `skills/<이름>/SKILL.md` 작성(frontmatter 에 `name`, `description` 필수)
→ `marketplace.json` 의 `dotagents` 엔트리 `skills` 배열에 경로 추가 → 위 표에 한 줄 추가
→ `claude plugin validate .` → push

**카탈로그 추가** — 넣기 전에 자립형인지 확인한다. `200` 이면 주소만 적으면 되고,
`404` 면 정의가 상위 마켓플레이스에 있으니 넣지 않는다.

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://raw.githubusercontent.com/<owner>/<repo>/main/.claude-plugin/plugin.json
```

엔트리는 이렇게 적는다. `github` 소스 타입은 SSH 로 clone 을 시도하므로 `url` + https 를 쓴다.

```json
{
  "name": "<이름>",
  "description": "<설명>",
  "source": { "source": "url", "url": "https://github.com/<owner>/<repo>.git" }
}
```
