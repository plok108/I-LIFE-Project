package ac.kr.inhatc.campus.market.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMarketPostRequest {

    // 게시글 종류: 'SELL' (판매해요) / 'BUY' (구해요)
    private String type;

    private String title;
    private String description;
    private Integer priceKrw;
    private String category;

    // 작성자 (author_id)
    private Long authorId;

    // 거래 상태: 'ACTIVE', 'SUSPENDED', 'DELETED'
    // - ACTIVE: 노출 중 (판매중 / 구해요)
    // - SUSPENDED: 거래 중단, 거래 끝, 사실상 "판매완료" 취급 가능
    // - DELETED: 숨김/삭제
    private String status;
}
