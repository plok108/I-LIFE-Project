package ac.kr.inhatc.campus.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // bigint

    @Column(unique = true, nullable = false, length = 50)
    private String username; // varchar(50)

    @Column(nullable = false, length = 120, unique = true)
    private String email; // varchar(120)

    @Column(name = "password_hash", nullable = false, length = 255)
    private String password; // varchar(255)

    @Column(nullable = false, length = 100)
    private String name; // varchar(100)

    @Column(length = 30)
    private String phone; // varchar(30)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE; // enum('ACTIVE','SUSPENDED','DELETED')

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // enum('ADMIN','MANAGER','USER')

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // datetime

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // datetime

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = Status.ACTIVE;
        }
        if (role == null) {
            role = Role.USER;
        }
    }

    public enum Status {
        ACTIVE, SUSPENDED, DELETED
    }

    public enum Role {
        ADMIN, MANAGER, USER
    }
}
