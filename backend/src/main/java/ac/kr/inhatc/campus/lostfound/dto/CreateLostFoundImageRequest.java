package ac.kr.inhatc.campus.lostfound.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateLostFoundImageRequest {
    private Long lostFoundId; // 어떤 글에 대한 이미지인지
    private String url;
    private Boolean isPrimary;
}
