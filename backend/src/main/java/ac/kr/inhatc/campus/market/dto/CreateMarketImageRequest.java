package ac.kr.inhatc.campus.market.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMarketImageRequest {
    private Long postId;     // 어떤 게시글의 이미지인지 (market_post.id)
    private String url;
    private Boolean isPrimary;
}
