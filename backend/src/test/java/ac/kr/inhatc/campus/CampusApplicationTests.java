package ac.kr.inhatc.campus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// ★ 메인 클래스 이름을 '실제 파일명'으로 바꾸세요.
//   예: CampusBackendApplication (보통 src/main/java/ac/kr/inhatc/campus 아래에 있음)
@SpringBootTest(classes = CampusBackendApplication.class)
@ActiveProfiles("test")
class CampusApplicationTests {

    @Test
    void contextLoads() {}
}
