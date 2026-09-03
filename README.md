# dotagents

Claude Code · Codex · opencode 세 에이전트가 **같은 레포 하나**를 각자의 방식으로
설치해서 쓰는 개인 스킬 모음.

스킬 본문은 `skills/` 한 곳에만 있고, 매니페스트 3개가 같은 디렉터리를 각자
형식으로 가리킨다. 내용 중복이 없다.

## 설치

새 머신·새 환경에서 clone 없이 아래 명령만 실행하면 된다.

### Claude Code

```bash
claude plugin marketplace add als8921/dotagents
claude plugin install dotagents@dotagents
```

### Codex

```bash
codex plugin marketplace add als8921/dotagents
codex plugin add dotagents@dotagents
```

### opencode

`~/.config/opencode/opencode.json`에 한 줄:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["dotagents@git+https://github.com/als8921/dotagents.git"]
}
```

> **반드시 `@git+https://...` 까지 붙일 것.** npm 레지스트리에 `dotagents` 라는
> 동명의 무관한 패키지(beautyfree/dotagents)가 이미 있어서, bare name 으로 쓰면
> 그쪽이 받아진다.

## 이 레포에 넣는 것 / 넣지 않는 것

**넣는다** — 직접 만든 스킬. 다른 데서 받아올 곳이 없으므로 여기가 유일한 원본이다.

**넣지 않는다** — 남이 만든 스킬(archify, hallmark, find-skills 등). 이들은
`~/.agents/skills/`에 두고 `npx skills`로 업스트림 갱신을 받는다. Codex와 opencode는
`~/.agents/skills/`를 **네이티브로 읽으므로** 설정이 필요 없고, Claude Code만
`~/.claude/skills/<이름> -> ../../.agents/skills/<이름>` 심링크가 필요하다.

## 갱신

스킬을 고쳐 push 한 뒤, 각 에이전트에서:

```bash
claude plugin update dotagents              # 적용하려면 Claude Code 재시작
codex plugin marketplace upgrade dotagents  # 마켓플레이스 스냅샷 갱신
                                            # opencode 는 재시작 시 자동 재해석
```

## 개발 중일 때

마켓플레이스 설치는 스킬을 각 에이전트의 캐시로 **복사**한다. 그래서 스킬을 고치면
`git commit` → `git push` → 각 에이전트에서 update 를 해야 반영된다.

주력 머신에서 스킬을 자주 손본다면 로컬 경로로 붙여두는 편이 낫다:

```bash
claude plugin marketplace add ~/Develop/dotagents   # 그래도 commit 은 필요
codex plugin marketplace add ~/Develop/dotagents    # 그래도 commit 은 필요
```

opencode만은 `file:` 스펙으로 붙이면 **작업 디렉터리를 직접 읽어서** commit 없이
저장 즉시 반영된다:

```json
{ "plugin": ["dotagents@file:/Users/imincheol/Develop/dotagents"] }
```

## 구조

```
dotagents/
├── skills/                            스킬 본문 (유일한 원본)
│   └── <skill-name>/SKILL.md
├── .claude-plugin/marketplace.json    Claude Code 마켓플레이스
├── .agents/plugins/marketplace.json   Codex 마켓플레이스
├── .codex-plugin/plugin.json          Codex 플러그인 본체 (skills: "./skills/")
├── package.json                       opencode 플러그인 진입점 선언
└── .opencode/plugins/dotagents.js     opencode 플러그인 (skills.paths 주입)
```

## 스킬 추가하기

1. `skills/<이름>/SKILL.md` 작성 (frontmatter에 `name`, `description` 필수)
2. `.claude-plugin/marketplace.json`의 `skills` 배열에 `"./skills/<이름>"` 추가
   — Codex와 opencode는 `skills/` 전체를 스캔하므로 이 파일만 손대면 된다
3. `claude plugin validate .` 로 매니페스트 검증
4. commit → push

## 검증 방법

```bash
claude plugin details dotagents          # Claude: 스킬 인벤토리
codex plugin list | grep dotagents       # Codex: 설치 상태
opencode debug skill | grep dotagents    # opencode: 로드된 경로
```
