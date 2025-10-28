package ac.kr.inhatc.campus.api;

import ac.kr.inhatc.campus.lostfound.domain.LostFound;
import ac.kr.inhatc.campus.lostfound.domain.LostFoundImage;
import ac.kr.inhatc.campus.lostfound.dto.CreateLostFoundRequest;
import ac.kr.inhatc.campus.lostfound.dto.CreateLostFoundImageRequest;
import ac.kr.inhatc.campus.lostfound.repository.LostFoundRepository;
import ac.kr.inhatc.campus.lostfound.repository.LostFoundImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lost-found")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LostFoundController {

    private final LostFoundRepository lostFoundRepository;
    private final LostFoundImageRepository lostFoundImageRepository;

    // 전체 조회
    @GetMapping
    public List<LostFound> getAll() {
        return lostFoundRepository.findAll();
    }

    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<LostFound> getOne(@PathVariable Long id) {
        return lostFoundRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 타입별 조회 (LOST / FOUND)
    @GetMapping("/type/{type}")
    public List<LostFound> getByType(@PathVariable String type) {
        LostFound.Type enumType = LostFound.Type.valueOf(type.toUpperCase());
        return lostFoundRepository.findByTypeOrderByCreatedAtDesc(enumType);
    }

    // 상태별 조회 (OPEN / MATCHED / CLOSED)
    @GetMapping("/status/{status}")
    public List<LostFound> getByStatus(@PathVariable String status) {
        LostFound.Status enumStatus = LostFound.Status.valueOf(status.toUpperCase());
        return lostFoundRepository.findByStatusOrderByCreatedAtDesc(enumStatus);
    }

    // 작성자별 조회
    @GetMapping("/author/{authorId}")
    public List<LostFound> getByAuthor(@PathVariable Long authorId) {
        return lostFoundRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    // 글 등록
    @PostMapping
    public ResponseEntity<LostFound> createLostFound(@RequestBody CreateLostFoundRequest req) {
        LostFound post = new LostFound();
        post.setType(LostFound.Type.valueOf(req.getType().toUpperCase())); // LOST / FOUND
        post.setTitle(req.getTitle());
        post.setDescription(req.getDescription());
        post.setCategory(req.getCategory());

        if (req.getLostDate() != null && !req.getLostDate().isEmpty()) {
            post.setLostDate(LocalDate.parse(req.getLostDate())); // "2025-10-28" 형식 가정
        }

        post.setBuildingId(req.getBuildingId());
        post.setLat(req.getLat());
        post.setLng(req.getLng());

        // status는 기본 OPEN으로 둘 거라면 req에서 안 받아도 되지만,
        // 보내면 반영
        if (req.getStatus() != null && !req.getStatus().isEmpty()) {
            post.setStatus(LostFound.Status.valueOf(req.getStatus().toUpperCase()));
        } else {
            post.setStatus(LostFound.Status.OPEN);
        }

        post.setContact(req.getContact());
        post.setAuthorId(req.getAuthorId());

        LostFound saved = lostFoundRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    // 이미지 목록 조회
    @GetMapping("/{lostFoundId}/images")
    public List<LostFoundImage> getImages(@PathVariable Long lostFoundId) {
        return lostFoundImageRepository.findByLostFound_IdOrderByIsPrimaryDescIdAsc(lostFoundId);
    }

    // 이미지 등록
    @PostMapping("/images")
    public ResponseEntity<LostFoundImage> createImage(@RequestBody CreateLostFoundImageRequest req) {
        LostFound parent = lostFoundRepository.findById(req.getLostFoundId())
                .orElseThrow(() -> new IllegalArgumentException("lost_found not found: " + req.getLostFoundId()));

        LostFoundImage img = new LostFoundImage();
        img.setLostFound(parent);
        img.setUrl(req.getUrl());
        img.setIsPrimary(req.getIsPrimary());

        LostFoundImage saved = lostFoundImageRepository.save(img);
        return ResponseEntity.ok(saved);
    }

    // 특정 글의 모든 이미지 삭제
    @DeleteMapping("/{lostFoundId}/images")
    public ResponseEntity<Void> deleteImages(@PathVariable Long lostFoundId) {
        lostFoundImageRepository.deleteByLostFound_Id(lostFoundId);
        return ResponseEntity.ok().build();
    }
}
