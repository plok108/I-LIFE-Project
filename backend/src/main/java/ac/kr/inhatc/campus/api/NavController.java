package ac.kr.inhatc.campus.api;

import ac.kr.inhatc.campus.nav.domain.CampusBuilding;
import ac.kr.inhatc.campus.nav.domain.MapNode;
import ac.kr.inhatc.campus.nav.domain.Poi;
import ac.kr.inhatc.campus.nav.dto.RouteRequestDto;
import ac.kr.inhatc.campus.nav.dto.RouteResponseDto;
import ac.kr.inhatc.campus.nav.dto.BuildingDto;
import ac.kr.inhatc.campus.nav.repository.CampusBuildingRepository;
import ac.kr.inhatc.campus.nav.repository.MapNodeRepository;
import ac.kr.inhatc.campus.nav.repository.PoiRepository;
import ac.kr.inhatc.campus.nav.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nav")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class NavController {

    private final CampusBuildingRepository campusBuildingRepository;
    private final MapNodeRepository mapNodeRepository;
    private final PoiRepository poiRepository;
    private final RouteService routeService;

    // 모든 건물 조회
    @GetMapping("/buildings")
    public List<BuildingDto> getAllBuildings() {
        return campusBuildingRepository.findAll().stream()
                .map(this::convertToBuildingDto)
                .collect(Collectors.toList());
    }

    // 건물 ID로 조회
    @GetMapping("/buildings/{id}")
    public ResponseEntity<BuildingDto> getBuildingById(@PathVariable Long id) {
        Optional<CampusBuilding> building = campusBuildingRepository.findById(id);
        return building
                .map(b -> ResponseEntity.ok(convertToBuildingDto(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 건물 코드로 조회
    @GetMapping("/buildings/code/{code}")
    public ResponseEntity<BuildingDto> getBuildingByCode(@PathVariable String code) {
        Optional<CampusBuilding> building = campusBuildingRepository.findAll().stream()
                .filter(b -> code.equals(b.getCode()))
                .findFirst();

        return building
                .map(b -> ResponseEntity.ok(convertToBuildingDto(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 모든 노드 조회
    @GetMapping("/nodes")
    public List<MapNode> getAllNodes() {
        return mapNodeRepository.findAll();
    }

    // 건물별 노드 조회
    @GetMapping("/nodes/building/{buildingId}")
    public List<MapNode> getNodesByBuilding(@PathVariable Long buildingId) {
        // 다시 원래 방식으로: floor=null 넣어서 해당 building 전체 노드 불러오기
        // 이 메서드는 기존 코드에 존재한다고 확인됨.
        return mapNodeRepository.findByBuildingIdAndFloor(buildingId, null);
    }

    // 건물+층별 노드 조회
    @GetMapping("/nodes/building/{buildingId}/floor/{floor}")
    public List<MapNode> getNodesByBuildingAndFloor(@PathVariable Long buildingId,
                                                     @PathVariable Integer floor) {
        return mapNodeRepository.findByBuildingIdAndFloor(buildingId, floor);
    }

    // 모든 POI 조회
    @GetMapping("/pois")
    public List<Poi> getAllPois() {
        return poiRepository.findAll();
    }

    // 건물별 POI 조회
    @GetMapping("/pois/building/{buildingId}")
    public List<Poi> getPoisByBuilding(@PathVariable Long buildingId) {
        return poiRepository.findByBuildingId(buildingId);
    }

    // POI 검색
    @GetMapping("/pois/search")
    public List<Poi> searchPois(@RequestParam String keyword) {
        return poiRepository.findByNameContainingIgnoreCase(keyword);
    }

    // 경로 찾기
    @PostMapping("/route")
    public ResponseEntity<RouteResponseDto> findRoute(@RequestBody RouteRequestDto request) {
        RouteResponseDto response = routeService.findRoute(request);
        return ResponseEntity.ok(response);
    }

    private BuildingDto convertToBuildingDto(CampusBuilding building) {
        return BuildingDto.builder()
                .id(building.getId())
                .code(building.getCode())
                .name(building.getName())
                .description(building.getDescription())
                .lat(building.getLat())
                .lng(building.getLng())
                .createdAt(building.getCreatedAt())
                .updatedAt(building.getUpdatedAt())
                .build();
    }
}
