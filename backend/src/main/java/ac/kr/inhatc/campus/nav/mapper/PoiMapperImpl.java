package ac.kr.inhatc.campus.nav.mapper;

import ac.kr.inhatc.campus.nav.domain.Poi;
import ac.kr.inhatc.campus.nav.dto.PoiDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PoiMapperImpl {
    PoiDto toDto(Poi entity);
    Poi toEntity(PoiDto dto);
}
