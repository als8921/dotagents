# dotagents

Claude Code · Codex · opencode 세 에이전트가 **같은 레포 하나**를 각자의 방식으로
설치해서 쓰는 개인 스킬·플러그인 모음.

담는 방법은 두 가지다.

- **파일로 담기** — 직접 만든 스킬. 원본이 여기밖에 없으니 `skills/` 에 실제 파일을 둔다.
- **주소로 담기** — 남이 만든 스킬·플러그인. 파일을 복사하지 않고 마켓플레이스 카탈로그에
  출처만 적는다. 설치 시점에 각자 원본에서 받아오므로 재배포가 아니고, 업스트림 갱신도
  그대로 따라간다.

---

## 무엇이 들어 있나

### 자작 스킬 — `skills/`

| 스킬 | 설명 |
|---|---|
| _(아직 없음)_ | |

### 카탈로그 — 주소만 등록한 것

| 플러그인 | 제공하는 것 | 출처 | 자립 |
|---|---|---|:--:|
| `superpowers` | 스킬 14 — 브레인스토밍, TDD, 체계적 디버깅, 플랜 작성·실행, 코드리뷰, worktree, 병렬 에이전트 + SessionStart 훅 | [obra/superpowers](https://github.com/obra/superpowers) | ✅ |
| `diagram-design` | 스킬 6 — 39종 다이어그램을 자체 완결 HTML/SVG 로 생성, drawio·mermaid 임포트, 내보내기, 프로파일, 진단 | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) · MIT | ✅ |
| `document-skills` | 스킬 4 — xlsx, docx, pptx, pdf 문서 처리 | [anthropics/skills](https://github.com/anthropics/skills) | ⚠️ |
| `claude-hud` | 커맨드 2 — 상태줄 HUD 설정·구성 | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) | ✅ |

**자립** = 그 레포에 `.claude-plugin/plugin.json` 이 있어 플러그인이 자기 정의를 들고 다닌다.
⚠️ 는 정의가 상위 마켓플레이스 엔트리에만 있어서 이 레포가 베껴 온 경우 — 지금은 동작하지만
상위가 구성을 바꾸면 따라가지 못한다.

> 카탈로그 참조는 **Claude Code 에서만** 동작한다. Codex 와 opencode 에는 참조 개념이
> 없으므로, 자작 스킬만 세 에이전트에 퍼지고 남의 플러그인은 각자 설치한다.

### 담지 않는 것

- **설정이 상위 마켓플레이스에만 있는 플러그인.** `clangd-lsp` 는 플러그인 디렉터리에
  LICENSE 와 README 뿐이고 실제 LSP 설정은 상위 `marketplace.json` 의 `lspServers`
  블록에 있다. 주소만 참조하면 껍데기가 깔린다. 공식 마켓플레이스에서 직접 설치한다.
- **서드파티 스킬** (archify, hallmark, find-skills, excalidraw-diagram-generator).
  `~/.agents/skills/` 에 두고 `npx skills` 로 업스트림 갱신을 받는다. Codex 와 opencode 는
  이 경로를 **네이티브로 읽으므로** 설정이 필요 없고, Claude Code 만
  `~/.claude/skills/<이름> -> ../../.agents/skills/<이름>` 심링크가 필요하다.

### 새 항목을 카탈로그에 넣기 전 확인

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://raw.githubusercontent.com/<owner>/<repo>/main/.claude-plugin/plugin.json
```

`200` 이면 자립형이라 주소만 적으면 된다. `404` 면 정의가 상위 마켓플레이스에 있으니,
그 엔트리를 통째로 베껴 오거나 카탈로그에 넣지 않는다.

---

## 설치

새 머신·새 환경에서 clone 없이 아래 명령만 실행하면 된다.

### Claude Code

```bash
claude plugin marketplace add als8921/dotagents
claude plugin install dotagents@dotagents          # 자작 스킬
claude plugin install superpowers@dotagents        # 필요한 것만 골라서
claude plugin install diagram-design@dotagents
```

### Codex

```bash
codex plugin marketplace add als8921/dotagents
codex plugin add dotagents@dotagents
```

### opencode

`~/.config/opencode/opencode.json` 에 한 줄:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["dotagents@git+https://github.com/als8921/dotagents.git"]
}
```

> **반드시 `@git+https://...` 까지 붙일 것.** npm 레지스트리에 `dotagents` 라는
> 동명의 무관한 패키지(beautyfree/dotagents)가 이미 있어서, bare name 으로 쓰면
> 그쪽이 받아진다.

---

## 갱신

**자동 갱신은 없다.** 마켓플레이스 카탈로그(어떤 플러그인이 있는지)는 자동으로
최신화되지만, 설치된 플러그인 본체는 직접 갱신해야 한다.

```bash
claude plugin update <이름>                  # 적용하려면 Claude Code 재시작
codex plugin marketplace upgrade dotagents  # 마켓플레이스 스냅샷 갱신
                                            # opencode 는 재시작 시 자동 재해석
```

---

## 구조

```
dotagents/
├── skills/                            자작 스킬 본문 (유일한 원본)
│   └── <skill-name>/SKILL.md
├── .claude-plugin/marketplace.json    Claude Code 마켓플레이스 — 자작 + 카탈로그
├── .agents/plugins/marketplace.json   Codex 마켓플레이스
├── .codex-plugin/plugin.json          Codex 플러그인 본체 (skills: "./skills/")
├── package.json                       opencode 플러그인 진입점 선언
└── .opencode/plugins/dotagents.js     opencode 플러그인 (skills.paths 주입)
```

## 스킬 추가하기

1. `skills/<이름>/SKILL.md` 작성 (frontmatter 에 `name`, `description` 필수)
2. `.claude-plugin/marketplace.json` 의 `dotagents` 엔트리 `skills` 배열에
   `"./skills/<이름>"` 추가 — Codex 와 opencode 는 `skills/` 전체를 스캔하므로
   이 파일만 손대면 된다
3. 위 **무엇이 들어 있나** 표에 한 줄 추가
4. `claude plugin validate .` 로 매니페스트 검증
5. commit → push

## 검증 방법

```bash
claude plugin details dotagents          # Claude: 스킬 인벤토리
codex plugin list | grep dotagents       # Codex: 설치 상태
opencode debug skill | grep dotagents    # opencode: 로드된 경로
```
