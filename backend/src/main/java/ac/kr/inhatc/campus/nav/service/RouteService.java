package ac.kr.inhatc.campus.nav.service;

import ac.kr.inhatc.campus.nav.domain.PathEdge;
import ac.kr.inhatc.campus.nav.domain.PathNode;
import ac.kr.inhatc.campus.nav.dto.RouteRequestDto;
import ac.kr.inhatc.campus.nav.dto.RouteResponseDto;
import ac.kr.inhatc.campus.nav.dto.RouteStepDto;
import ac.kr.inhatc.campus.nav.repository.PathEdgeRepository;
import ac.kr.inhatc.campus.nav.repository.PathNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final PathNodeRepository nodeRepo;
    private final PathEdgeRepository edgeRepo;

    /**
     * 출발 노드 → 도착 노드까지 최단 경로를 계산하고
     * 프론트에서 바로 쓸 수 있는 DTO(RouteResponseDto)로 변환해서 반환.
     */
    public RouteResponseDto findRoute(RouteRequestDto req) {

        Long startNodeId   = req.getStartNodeId();
        Long endNodeId     = req.getEndNodeId();
        boolean accessible = req.isAccessible(); // 휠체어 경로 등 옵션 (아직은 안 막고 있음)

        // 1) 다익스트라로 최단 경로 노드 ID 리스트 구하기
        List<Long> pathNodeIds = runDijkstra(startNodeId, endNodeId, accessible);

        // 경로를 못 찾은 경우
        if (pathNodeIds.isEmpty()) {
            return RouteResponseDto.builder()
                    .totalDistanceMeter(0.0)
                    .estimatedSeconds(0)
                    .pathNodeIds(Collections.emptyList())
                    .steps(Collections.emptyList())
                    .build();
        }

        // 2) 노드 ID 리스트 -> 상세 스텝들(좌표, 층, 안내문 등)
        List<RouteStepDto> steps = buildSteps(pathNodeIds);

        // 3) 총 거리(m)
        double totalDist = calcTotalDistance(pathNodeIds, accessible);

        // 4) 예상 소요 시간(초)
        //    대충 사람이 걷는 평균속도 1.4 m/s 기준
        int estimatedSec = (int) Math.round(totalDist / 1.4);

        // 5) 최종 응답 DTO
        return RouteResponseDto.builder()
                .totalDistanceMeter(totalDist)
                .estimatedSeconds(estimatedSec)
                .pathNodeIds(pathNodeIds)
                .steps(steps)
                .build();
    }

    /**
     * 다익스트라 알고리즘으로 startId→endId 최단경로를 구한다.
     * - node: path_node.node_id
     * - edge: path_edge(from_node_id -> to_node_id, distance_meter, is_active ...)
     */
    private List<Long> runDijkstra(Long startId, Long endId, boolean accessibleOnly) {

        // start에서 각 노드까지 최소 거리
        Map<Long, Double> dist = new HashMap<>();
        // 최단 경로에서의 이전 노드 기록
        Map<Long, Long>   prev = new HashMap<>();
        // 방문 여부
        Set<Long>         visited = new HashSet<>();

        // (nodeId, distance) 우선순위큐. 거리 짧은 순으로 poll
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingDouble(a -> a[1]));

        dist.put(startId, 0.0);
        pq.offer(new long[]{startId, 0});

        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            Long curNodeId = cur[0];

            if (visited.contains(curNodeId)) continue;
            visited.add(curNodeId);

            // 이미 목적지면 break 가능 (다익스트라 특성상 이 시점 최단이 확정)
            if (curNodeId.equals(endId)) break;

            // 현재 노드에서 나가는 간선들
            List<PathEdge> outgoingEdges = edgeRepo.findByFromNodeIdAndIsActiveTrue(curNodeId);

            for (PathEdge edge : outgoingEdges) {
                // 접근성 옵션(휠체어 경로 등) 적용하고 싶으면 여기서 필터
                if (accessibleOnly && isNotAccessible(edge)) {
                    continue;
                }

                Long nextNodeId = edge.getToNodeId();
                double newCost = dist.get(curNodeId) + safe(edge.getDistanceMeter());

                if (newCost < dist.getOrDefault(nextNodeId, Double.POSITIVE_INFINITY)) {
                    dist.put(nextNodeId, newCost);
                    prev.put(nextNodeId, curNodeId);
                    pq.offer(new long[]{nextNodeId, (long)newCost});
                }
            }
        }

        // endId까지 경로 없으면 빈 리스트
        if (!startId.equals(endId) && !prev.containsKey(endId)) {
            return Collections.emptyList();
        }

        // prev를 거슬러 올라가면서 경로 복원
        List<Long> path = new ArrayList<>();
        Long cur = endId;
        path.add(cur);
        while (!cur.equals(startId)) {
            cur = prev.get(cur);
            path.add(cur);
        }
        Collections.reverse(path);
        return path;
    }

    /**
     * pathNodeIds -> RouteStepDto 목록 생성
     * 여기서 lat / lng / floor / 안내문까지 채워서
     * 프론트가 바로 지도 + 안내문 쓸 수 있게 만든다.
     */
    private List<RouteStepDto> buildSteps(List<Long> pathNodeIds) {
        List<RouteStepDto> steps = new ArrayList<>();

        PathNode prevNode = null;

        for (Long nodeId : pathNodeIds) {
            PathNode node = nodeRepo.findById(nodeId)
                    .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));

            // ✅ lat / lng 추가 세팅
            RouteStepDto step = RouteStepDto.builder()
                    .nodeId(node.getNodeId())
                    .lat(node.getLat())     // ✅ PathNode에 lat 필드 있다고 가정
                    .lng(node.getLng())     // ✅ PathNode에 lng 필드 있다고 가정
                    .floor(node.getFloor())
                    .instruction(null)
                    .distanceMeter(0.0)
                    .build();

            // 층이 바뀌면 안내문 자동 부여
            if (prevNode != null && !Objects.equals(prevNode.getFloor(), node.getFloor())) {
                step.setInstruction(prevNode.getFloor() + "층 → " + node.getFloor() + "층 이동");
            }

            steps.add(step);
            prevNode = node;
        }

        // 각 step 간 거리 채워넣기 (distanceMeter)
        fillDistancePerStep(steps, pathNodeIds);

        return steps;
    }

    /**
     * step[i] -> step[i+1] 로 이동할 때 이동한 거리(m)를
     * steps[i+1].distanceMeter 로 넣어준다.
     * (이건 UI에서 "다음 구간 12.3m 이동" 이런 안내에도 쓸 수 있음)
     */
    private void fillDistancePerStep(List<RouteStepDto> steps, List<Long> pathNodeIds) {

        for (int i = 0; i < pathNodeIds.size() - 1; i++) {
            Long a = pathNodeIds.get(i);
            Long b = pathNodeIds.get(i + 1);

            // a -> b 간선들 중 거리 찾기
            List<PathEdge> edges = edgeRepo.findByFromNodeIdAndIsActiveTrue(a);
            double distAB = 0.0;
            for (PathEdge e : edges) {
                if (Objects.equals(e.getToNodeId(), b)) {
                    distAB = safe(e.getDistanceMeter());
                    break;
                }
            }

            // 다음 스텝(= b 지점)에 이 구간의 거리 기록
            RouteStepDto nextStep = steps.get(i + 1);
            nextStep.setDistanceMeter(distAB);
        }
    }

    /**
     * 전체 경로의 총 거리(m)
     */
    private double calcTotalDistance(List<Long> pathNodeIds, boolean accessibleOnly) {
        double sum = 0.0;

        for (int i = 0; i < pathNodeIds.size() - 1; i++) {
            Long a = pathNodeIds.get(i);
            Long b = pathNodeIds.get(i + 1);

            List<PathEdge> edges = edgeRepo.findByFromNodeIdAndIsActiveTrue(a);

            for (PathEdge e : edges) {
                if (Objects.equals(e.getToNodeId(), b)) {
                    if (accessibleOnly && isNotAccessible(e)) continue;
                    sum += safe(e.getDistanceMeter());
                    break;
                }
            }
        }

        return sum;
    }

    /**
     * 추후 휠체어/엘리베이터 전용 경로 같은 제약을 적용할 자리.
     * 지금은 전부 허용하니까 false(=막지 않는다) 리턴.
     */
    private boolean isNotAccessible(PathEdge e) {
        // 예: return e.isStairsOnly() && userWantsAccessibleRoute;
        return false;
    }

    private double safe(Double v) {
        return v == null ? 0.0 : v;
    }
}
