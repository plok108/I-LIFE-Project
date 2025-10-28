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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nav")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NavController {
    
    @Autowired
    private CampusBuildingRepository campusBuildingRepository;
    
    @Autowired
    private MapNodeRepository mapNodeRepository;
    
    @Autowired
    private PoiRepository poiRepository;
    
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
        return building.map(b -> ResponseEntity.ok(convertToBuildingDto(b)))
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // 건물 코드로 조회
    @GetMapping("/buildings/code/{code}")
    public ResponseEntity<BuildingDto> getBuildingByCode(@PathVariable String code) {
        Optional<CampusBuilding> building = campusBuildingRepository.findAll().stream()
                .filter(b -> code.equals(b.getCode()))
                .findFirst();
        return building.map(b -> ResponseEntity.ok(convertToBuildingDto(b)))
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
        return mapNodeRepository.findByBuildingIdAndFloor(buildingId, null);
    }
    
    // 건물과 층별 노드 조회
    @GetMapping("/nodes/building/{buildingId}/floor/{floor}")
    public List<MapNode> getNodesByBuildingAndFloor(@PathVariable Long buildingId, @PathVariable Integer floor) {
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
    
    // 경로 찾기 (기본 구현 - 실제로는 알고리즘 필요)
    @PostMapping("/route")
    public ResponseEntity<RouteResponseDto> findRoute(@RequestBody RouteRequestDto request) {
        // TODO: 실제 경로 찾기 알고리즘 구현
        RouteResponseDto response = RouteResponseDto.builder()
                .totalDistanceMeter(0.0)
                .estimatedSeconds(0)
                .pathNodeIds(List.of())
                .steps(List.of())
                .build();
        return ResponseEntity.ok(response);
    }
    
    // CampusBuilding을 BuildingDto로 변환하는 메서드
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
