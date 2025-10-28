package ac.kr.inhatc.campus.user.repository;

import ac.kr.inhatc.campus.user.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findByEmail(String email);
    Optional<UserAccount> findByUsernameOrEmail(String username, String email);
    List<UserAccount> findByStatus(UserAccount.Status status);
    List<UserAccount> findByRole(UserAccount.Role role);
    List<UserAccount> findByStatusAndRole(UserAccount.Status status, UserAccount.Role role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
