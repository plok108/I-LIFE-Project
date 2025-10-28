package ac.kr.inhatc.campus.api;

import ac.kr.inhatc.campus.market.domain.MarketPost;
import ac.kr.inhatc.campus.market.domain.MarketImage;
import ac.kr.inhatc.campus.market.dto.CreateMarketPostRequest;
import ac.kr.inhatc.campus.market.dto.CreateMarketImageRequest;
import ac.kr.inhatc.campus.market.repository.MarketPostRepository;
import ac.kr.inhatc.campus.market.repository.MarketImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/market")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MarketController {

    private final MarketPostRepository marketPostRepository;
    private final MarketImageRepository marketImageRepository;

    // 문자열로 온 status ("ACTIVE","RESERVED","SOLD","DELETED")를 enum으로
    private MarketPost.Status parseStatus(String raw) {
        if (raw == null) return null;
        switch (raw.toUpperCase()) {
            case "ACTIVE":
                return MarketPost.Status.ACTIVE;
            case "RESERVED":
                return MarketPost.Status.RESERVED;
            case "SOLD":
                return MarketPost.Status.SOLD;
            case "DELETED":
                return MarketPost.Status.DELETED;
            default:
                return null;
        }
    }

    // 1) 전체 게시글 조회
    @GetMapping
    public List<MarketPost> getAllPosts() {
        return marketPostRepository.findAll();
    }

    // 2) 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<MarketPost> getPost(@PathVariable Long id) {
        return marketPostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3) 카테고리별 조회
    @GetMapping("/category/{category}")
    public List<MarketPost> getByCategory(@PathVariable String category) {
        return marketPostRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    // 4) 작성자(author_id)별 조회
    @GetMapping("/author/{authorId}")
    public List<MarketPost> getByAuthor(@PathVariable Long authorId) {
        return marketPostRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    // 5) 새 글 작성 (POST /api/market)
    @PostMapping
    public ResponseEntity<MarketPost> createPost(@RequestBody CreateMarketPostRequest req) {

        MarketPost post = new MarketPost();

        // type: "SELL" / "BUY"
        post.setType(MarketPost.Type.valueOf(req.getType().toUpperCase()));

        post.setTitle(req.getTitle());
        post.setDescription(req.getDescription());
        post.setPriceKrw(req.getPriceKrw());
        post.setCategory(req.getCategory());
        post.setAuthorId(req.getAuthorId());

        // status 처리
        MarketPost.Status st = parseStatus(req.getStatus());
        if (st != null) {
            post.setStatus(st);
        } else {
            post.setStatus(MarketPost.Status.ACTIVE); // 기본
        }

        MarketPost saved = marketPostRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    // 6) 게시글 수정 (PUT /api/market/{id})
    @PutMapping("/{id}")
    public ResponseEntity<MarketPost> updatePost(
            @PathVariable Long id,
            @RequestBody CreateMarketPostRequest req
    ) {
        return marketPostRepository.findById(id)
                .map(post -> {

                    if (req.getType() != null) {
                        post.setType(MarketPost.Type.valueOf(req.getType().toUpperCase()));
                    }
                    if (req.getTitle() != null) {
                        post.setTitle(req.getTitle());
                    }
                    if (req.getDescription() != null) {
                        post.setDescription(req.getDescription());
                    }
                    if (req.getPriceKrw() != null) {
                        post.setPriceKrw(req.getPriceKrw());
                    }
                    if (req.getCategory() != null) {
                        post.setCategory(req.getCategory());
                    }
                    if (req.getStatus() != null) {
                        MarketPost.Status st2 = parseStatus(req.getStatus());
                        if (st2 != null) {
                            post.setStatus(st2);
                        }
                    }

                    MarketPost saved = marketPostRepository.save(post);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 7) 게시글 삭제 (DELETE /api/market/{id}) -> DB에서 완전히 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!marketPostRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        marketPostRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 8) 특정 글의 이미지 목록
    @GetMapping("/{postId}/images")
    public List<MarketImage> getImages(@PathVariable Long postId) {
        return marketImageRepository.findByPost_IdOrderByIsPrimaryDescIdAsc(postId);
    }

    // 9) 이미지 등록
    @PostMapping("/images")
    public ResponseEntity<MarketImage> createImage(@RequestBody CreateMarketImageRequest req) {
        MarketPost post = marketPostRepository.findById(req.getPostId())
                .orElseThrow(() ->
                        new IllegalArgumentException("post not found: " + req.getPostId())
                );

        MarketImage img = new MarketImage();
        img.setPost(post);
        img.setUrl(req.getUrl());
        img.setIsPrimary(req.getIsPrimary());

        MarketImage saved = marketImageRepository.save(img);
        return ResponseEntity.ok(saved);
    }

    // 10) 해당 글의 모든 이미지 삭제
    @DeleteMapping("/{postId}/images")
    public ResponseEntity<Void> deleteImages(@PathVariable Long postId) {
        marketImageRepository.deleteByPost_Id(postId);
        return ResponseEntity.noContent().build();
    }
}
