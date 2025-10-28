package ac.kr.inhatc.campus.api;

import ac.kr.inhatc.campus.user.domain.UserAccount;
import ac.kr.inhatc.campus.user.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {
    
    @Autowired
    private UserAccountRepository userAccountRepository;
    
    // 모든 사용자 조회
    @GetMapping
    public List<UserAccount> getAllUsers() {
        return userAccountRepository.findAll();
    }
    
    // ID로 사용자 조회
    @GetMapping("/{id}")
    public ResponseEntity<UserAccount> getUserById(@PathVariable Long id) {
        Optional<UserAccount> user = userAccountRepository.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // 사용자명으로 사용자 조회
    @GetMapping("/username/{username}")
    public ResponseEntity<UserAccount> getUserByUsername(@PathVariable String username) {
        Optional<UserAccount> user = userAccountRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // 새 사용자 생성
    @PostMapping
    public UserAccount createUser(@RequestBody UserAccount user) {
        return userAccountRepository.save(user);
    }
    
    // 사용자 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<UserAccount> updateUser(@PathVariable Long id, @RequestBody UserAccount userDetails) {
        Optional<UserAccount> user = userAccountRepository.findById(id);
        if (user.isPresent()) {
            UserAccount existingUser = user.get();
            // username과 email은 변경하지 않음 (보안상)
            if (userDetails.getName() != null) {
                existingUser.setName(userDetails.getName());
            }
            if (userDetails.getPhone() != null) {
                existingUser.setPhone(userDetails.getPhone());
            }
            if (userDetails.getStatus() != null) {
                existingUser.setStatus(userDetails.getStatus());
            }
            if (userDetails.getRole() != null) {
                existingUser.setRole(userDetails.getRole());
            }
            return ResponseEntity.ok(userAccountRepository.save(existingUser));
        }
        return ResponseEntity.notFound().build();
    }
    
    // 사용자 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userAccountRepository.existsById(id)) {
            userAccountRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
