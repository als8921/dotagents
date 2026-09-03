/**
 * dotagents plugin for opencode
 *
 * 이 레포의 skills/ 디렉터리를 opencode의 스킬 탐색 경로에 주입한다.
 * 심볼릭 링크나 사용자 설정 편집 없이, 플러그인 설치만으로 스킬이 보인다.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsDir = path.resolve(__dirname, '../../skills');

export const DotagentsPlugin = async () => {
  return {
    // Config.get()이 캐시된 싱글턴을 반환하므로, 여기서 수정하면
    // 이후 지연 탐색되는 스킬 로딩에 반영된다.
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },
  };
};
