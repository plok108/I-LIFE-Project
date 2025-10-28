package ac.kr.inhatc.campus.api;

import ac.kr.inhatc.campus.user.domain.UserAccount;
import ac.kr.inhatc.campus.user.dto.AuthResponse;
import ac.kr.inhatc.campus.user.dto.LoginRequest;
import ac.kr.inhatc.campus.user.dto.RegisterRequest;
import ac.kr.inhatc.campus.user.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserAccount user = authService.registerUser(
                request.getUsername(),
                request.getPassword(),
                request.getName(),
                request.getEmail(),
                request.getPhone()
            );
            
            AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
            
            AuthResponse response = AuthResponse.builder()
                .message("회원가입이 완료되었습니다")
                .user(userInfo)
                .build();
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            AuthResponse response = AuthResponse.builder()
                .message(e.getMessage())
                .build();
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("로그인 요청: " + request.getUsernameOrEmail());
        
        Optional<UserAccount> userOpt = authService.authenticateUser(
            request.getUsernameOrEmail(),
            request.getPassword()
        );
        
        if (userOpt.isPresent()) {
            UserAccount user = userOpt.get();
            System.out.println("로그인 성공: " + user.getUsername());
            
            AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
            
            AuthResponse response = AuthResponse.builder()
                .token("dummy-token-" + user.getId()) // 실제로는 JWT 토큰 생성
                .message("로그인 성공")
                .user(userInfo)
                .build();
            
            return ResponseEntity.ok(response);
        } else {
            System.out.println("로그인 실패: 사용자 찾을 수 없음 또는 비밀번호 불일치");
            AuthResponse response = AuthResponse.builder()
                .message("사용자명/이메일 또는 비밀번호가 올바르지 않습니다")
                .build();
            return ResponseEntity.badRequest().body(response);
        }
    }
}