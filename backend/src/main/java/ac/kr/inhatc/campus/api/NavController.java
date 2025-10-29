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
    private final RouteService routeService; // ✅ 길찾기 서비스 주입

    // =========================
    // Building (건물)
    // =========================

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

    // 건물 코드로 조회 (예: "E1관", "본관" 같은 코드)
    @GetMapping("/buildings/code/{code}")
    public ResponseEntity<BuildingDto> getBuildingByCode(@PathVariable String code) {
        Optional<CampusBuilding> building = campusBuildingRepository.findAll().stream()
                .filter(b -> code.equals(b.getCode()))
                .findFirst();

        return building
                .map(b -> ResponseEntity.ok(convertToBuildingDto(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // MapNode (길찾기 노드)
    // =========================

    // 모든 노드 조회
    @GetMapping("/nodes")
    public List<MapNode> getAllNodes() {
        return mapNodeRepository.findAll();
    }

    // 특정 건물의 노드들 조회
    @GetMapping("/nodes/building/{buildingId}")
    public List<MapNode> getNodesByBuilding(@PathVariable Long buildingId) {
        // ❌ 기존: findByBuildingIdAndFloor(buildingId, null)
        // ✅ 수정: 그냥 그 건물에 속한 노드 전부
        return mapNodeRepository.findByBuildingId(buildingId);
    }

    // 특정 건물 + 특정 층의 노드들 조회
    @GetMapping("/nodes/building/{buildingId}/floor/{floor}")
    public List<MapNode> getNodesByBuildingAndFloor(@PathVariable Long buildingId,
                                                     @PathVariable Integer floor) {
        return mapNodeRepository.findByBuildingIdAndFloor(buildingId, floor);
    }

    // =========================
    // POI (강의실/식당/행정실 등 목적지)
    // =========================

    // 모든 POI 조회
    @GetMapping("/pois")
    public List<Poi> getAllPois() {
        return poiRepository.findAll();
    }

    // 특정 건물 안의 POI 조회
    @GetMapping("/pois/building/{buildingId}")
    public List<Poi> getPoisByBuilding(@PathVariable Long buildingId) {
        return poiRepository.findByBuildingId(buildingId);
    }

    // POI 검색 (이름으로)
    @GetMapping("/pois/search")
    public List<Poi> searchPois(@RequestParam String keyword) {
        return poiRepository.findByNameContainingIgnoreCase(keyword);
    }

    // =========================
    // Route (길찾기)
    // =========================

    /**
     * 출발 노드 -> 도착 노드까지 경로 계산
     * 요청 JSON 예:
     * {
     *   "startNodeId": 101,
     *   "endNodeId": 342,
     *   "accessible": false
     * }
     */
    @PostMapping("/route")
    public ResponseEntity<RouteResponseDto> findRoute(@RequestBody RouteRequestDto request) {
        // ✅ 실제 경로 알고리즘 실행
        RouteResponseDto response = routeService.findRoute(request);
        return ResponseEntity.ok(response);
    }

    // =========================
    // private helpers
    // =========================
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
