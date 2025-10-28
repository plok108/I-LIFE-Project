package ac.kr.inhatc.campus.user.service;

import ac.kr.inhatc.campus.user.domain.UserAccount;
import ac.kr.inhatc.campus.user.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserAccountRepository userAccountRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public UserAccount registerUser(String username, String password, String name, String email, String phone) {
        // 중복 체크
        if (userAccountRepository.existsByUsername(username)) {
            throw new RuntimeException("이미 존재하는 사용자명입니다");
        }
        
        if (userAccountRepository.existsByEmail(email)) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(password);
        
        // 사용자 생성
        UserAccount user = new UserAccount();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setStatus(UserAccount.Status.ACTIVE);
        user.setRole(UserAccount.Role.USER);
        
        return userAccountRepository.save(user);
    }
    
    public Optional<UserAccount> authenticateUser(String usernameOrEmail, String password) {
        Optional<UserAccount> userOpt = userAccountRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
        
        if (userOpt.isPresent()) {
            UserAccount user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword()) && 
                user.getStatus() == UserAccount.Status.ACTIVE) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }
}

