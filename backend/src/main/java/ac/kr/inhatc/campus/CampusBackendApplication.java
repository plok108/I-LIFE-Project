package ac.kr.inhatc.campus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing   // created_at/updated_at 쓰면 권장
public class CampusBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusBackendApplication.class, args);
    }
}
