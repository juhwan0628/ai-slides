# AI Slides

**AI 코딩 에이전트와 함께 사용하는 로컬 우선 HTML 프레젠테이션 엔진**입니다. 사용자가 디자인을 결정하고, Codex·Claude Code 등의 AI 에이전트가 슬라이드를 구현합니다. 브라우저에서는 미리보기, 이미지 삽입·교체, PDF 저장을 수행합니다. 드래그 앤 드롭 방식의 슬라이드 편집기는 아닙니다.

## 시작하기

**준비물:** Node.js 20 이상, npm, VS Code 및 원하는 AI 코딩 에이전트.

```bash
git clone https://github.com/juhwan0628/ai-slides.git
cd ai-slides
npm ci
npm run setup:browser
npm run dev:local
```

브라우저에서 **http://127.0.0.1:3400/?project=demo** 를 열면 사용법을 설명하는 6페이지 예제 슬라이드를 볼 수 있습니다. 예제의 디자인 설계서는 [`projects/demo/DESIGN.md`](projects/demo/DESIGN.md)에 있습니다.

`npm run dev:local`은 사용자 PC의 `127.0.0.1`에서 실행되며 **이미지 삽입·교체를 허용**합니다. 이 모드를 외부 네트워크나 인터넷에 공개하지 마세요. 이미지 업로드가 차단된 읽기 전용 미리보기가 필요하다면 `npm run dev`를 사용하세요. 로컬 이용에는 nginx, 별도 도메인, VPS, 클라우드 서버가 필요하지 않습니다.

## 예제 삭제 후 새 발표 만들기

`projects/demo/`는 사용법을 보여주기 위한 **선택적 예제**입니다. 엔진 실행에 필요한 필수 템플릿이 아니며, 새 발표에 예제의 디자인이 자동으로 적용되지도 않습니다. 예제를 확인한 뒤 삭제하려면 다음 명령을 사용하세요.

```bash
# macOS / Linux
rm -rf projects/demo
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force projects/demo
```

**권장 순서:** 먼저 `projects/<slug>/DESIGN.md`를 작성하고 디자인을 승인받은 다음, AI 에이전트가 `manifest.json`, `slides.html`, `slides.css`를 생성하도록 하세요. 예제를 먼저 지워서 프로젝트가 하나도 없다면, 새 프로젝트를 만들 때까지 뷰어에 프로젝트가 없다는 안내가 표시됩니다.

- `http://127.0.0.1:3400/`: 존재하는 프로젝트 중 하나를 자동 선택
- `http://127.0.0.1:3400/?project=<slug>`: 지정한 프로젝트 열기
- `TEST_PROJECT=<slug> npm test`: 지정한 프로젝트로 자동 테스트
- `SLIDES_URL='http://127.0.0.1:3400/?project=<slug>' npm run verify`: 지정한 프로젝트 검증

사용하지 않는 `cache/`의 PDF 캐시나 `artifacts/`의 검증 결과는 실행 중인 PDF 생성 작업이 없을 때 삭제할 수 있습니다. **다른 프로젝트의 `assets/`는 삭제하지 마세요.**

테마 이름 `editorial-dev`는 예제의 `manifest.json`에 명시된 경우에만 적용됩니다. 테마를 지정하지 않은 새 프로젝트는 중립적인 흰색·회색 기본 마스터로 시작하며, 예제의 색상·레이아웃·문구를 상속하지 않습니다. 1920×1080(16:9) 캔버스와 HTML/PDF 출력, Noto Sans KR 글꼴 등은 엔진의 공통 기술 규격입니다.

## 실제 작업 흐름: 디자인 승인 후 개발

1. **디자인 설계 요청:** VS Code의 AI 에이전트에게 다음과 같이 요청합니다.

   > 새 발표 자료를 만들어 줘. 먼저 청중, 목적, 발표 시간, 색상, 타이포그래피, 슬라이드별 구성, 이미지 삽입 위치를 정의한 `projects/<slug>/DESIGN.md`부터 작성해. 내가 디자인을 승인하기 전에는 슬라이드를 구현하지 마.

2. **디자인 검토·승인:** `DESIGN.md`를 확인하고 수정 의견을 전달합니다. 명시적으로 승인한 후에만 구현을 진행합니다.
3. **AI 구현:** 에이전트가 승인된 문서를 기준으로 `manifest.json`, `slides.html`, `slides.css`를 작성하도록 합니다. [`AGENTS.md`](AGENTS.md)의 작업 규칙을 따르고, 기존 이미지 슬롯 ID를 유지하며, 일반적인 발표 제작에서는 `engine/`과 `server/`를 수정하지 않습니다.
4. **미리보기와 이미지 삽입:** `http://127.0.0.1:3400/?project=<slug>`에서 확인하고 이미지 영역을 클릭해 사진이나 스크린샷을 넣습니다. **PDF ↓** 버튼으로 결과물을 저장합니다.
5. **검증:** 자동 테스트와 실제 PDF 시각 검증 결과를 확인합니다.

프로젝트별 소스는 `projects/<slug>/`에 보관됩니다. PPTX 출력이나 GUI 기반 자유 편집 기능은 제공하지 않습니다.

## 테스트 및 PDF 검증

```bash
npm test
npm run verify
```

다른 프로젝트를 검증하려면:

```bash
SLIDES_URL='http://127.0.0.1:3400/?project=my-talk' npm run verify
```

`npm run verify`는 브라우저 화면과 인쇄용 화면을 캡처하고, **실제로 생성된 PDF**를 PDF.js로 이미지화해 페이지 수·비율·텍스트 넘침·이미지·폰트·시각적 차이를 검사합니다. 오류가 있으면 실패 상태로 종료하며, 의도적으로 비워 둔 이미지 슬롯은 경고로 표시됩니다. 결과는 Git에서 제외된 `artifacts/`와 `cache/`에 저장됩니다. 기본 보고서는 `artifacts/m5/report.json`에서 확인할 수 있습니다.

`npm run setup:browser`는 Playwright가 사용할 Chromium을 설치합니다. 별도 Chromium 경로가 필요하면 `CHROMIUM_PATH`를 지정할 수 있습니다. 기본 포트 3400을 변경할 때는 `PORT`를 사용하고, 검증 시 `SLIDES_URL`도 같은 포트로 맞추세요.

## 개인정보 및 보안

- `projects/*/assets/`는 Git 추적에서 제외됩니다. 실제 스크린샷, API 토큰, 기밀 문서를 공개 저장소에 넣지 마세요.
- 슬라이드 HTML은 브라우저에서 실행됩니다. 신뢰할 수 있는 프로젝트만 열어야 합니다.
- `npm run dev:local`은 신뢰할 수 있는 **자기 PC의 루프백 인터페이스**에서만 이미지 업로드를 허용하도록 사용하세요. 공개 서버에서는 인증 및 업로드 차단 정책을 별도로 구성해야 합니다.
- PDF 캐시는 발표 소스나 이미지가 변경되면 갱신됩니다. Safari에서도 완성된 PDF 파일을 내려받을 수 있도록 처리합니다.
- Linux 환경에서 클린 클론·설치·PDF 출력을 검증했습니다. macOS와 Windows는 대상 기기에서 추가 검증이 필요합니다.
