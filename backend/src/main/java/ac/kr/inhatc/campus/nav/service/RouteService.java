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

    public RouteResponseDto findRoute(RouteRequestDto req) {

        Long startNodeId   = req.getStartNodeId();
        Long endNodeId     = req.getEndNodeId();
        boolean accessible = req.isAccessible();

        // 1) 최단 경로 노드 리스트
        List<Long> pathNodeIds = runDijkstra(startNodeId, endNodeId, accessible);

        if (pathNodeIds.isEmpty()) {
            return RouteResponseDto.builder()
                    .totalDistanceMeter(0.0)
                    .estimatedSeconds(0)
                    .pathNodeIds(Collections.emptyList())
                    .steps(Collections.emptyList())
                    .build();
        }

        // 2) 노드 리스트 -> 상세 스텝
        List<RouteStepDto> steps = buildSteps(pathNodeIds);

        // 3) 총 거리(m)
        double totalDist = calcTotalDistance(pathNodeIds, accessible);

        // 4) 예상 시간(초) = 1.4 m/s 기준
        int estimatedSec = (int) Math.round(totalDist / 1.4);

        // 5) 응답 DTO
        return RouteResponseDto.builder()
                .totalDistanceMeter(totalDist)
                .estimatedSeconds(estimatedSec)
                .pathNodeIds(pathNodeIds)
                .steps(steps)
                .build();
    }

    private List<Long> runDijkstra(Long startId, Long endId, boolean accessibleOnly) {

        Map<Long, Double> dist = new HashMap<>();
        Map<Long, Long>   prev = new HashMap<>();
        Set<Long>         visited = new HashSet<>();

        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingDouble(a -> a[1]));
        // long[]{ nodeId, distance }

        dist.put(startId, 0.0);
        pq.offer(new long[]{startId, 0});

        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            Long curNodeId = cur[0];

            if (visited.contains(curNodeId)) continue;
            visited.add(curNodeId);

            if (curNodeId.equals(endId)) break;

            List<PathEdge> outgoingEdges = edgeRepo.findByFromNodeIdAndIsActiveTrue(curNodeId);

            for (PathEdge edge : outgoingEdges) {
                if (accessibleOnly && isNotAccessible(edge)) {
                    continue;
                }

                Long nextNodeId = edge.getToNodeId();

                // ⬇ 여기: getDistanceM() 으로 수정
                double newCost = dist.get(curNodeId) + safe(edge.getDistanceM());

                if (newCost < dist.getOrDefault(nextNodeId, Double.POSITIVE_INFINITY)) {
                    dist.put(nextNodeId, newCost);
                    prev.put(nextNodeId, curNodeId);
                    pq.offer(new long[]{nextNodeId, (long)newCost});
                }
            }
        }

        if (!startId.equals(endId) && !prev.containsKey(endId)) {
            return Collections.emptyList();
        }

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

    private List<RouteStepDto> buildSteps(List<Long> pathNodeIds) {
        List<RouteStepDto> steps = new ArrayList<>();

        PathNode prevNode = null;

        for (Long nodeId : pathNodeIds) {
            PathNode node = nodeRepo.findById(nodeId)
                    .orElseThrow(() -> new IllegalArgumentException("Node not found: " + nodeId));

            RouteStepDto step = RouteStepDto.builder()
                    .nodeId(node.getId())        // ⬅ getNodeId() → getId()
                    .lat(node.getLat())
                    .lng(node.getLng())
                    .floor(node.getFloor())
                    .instruction(null)
                    .distanceMeter(0.0)
                    .build();

            if (prevNode != null && !Objects.equals(prevNode.getFloor(), node.getFloor())) {
                step.setInstruction(prevNode.getFloor() + "층 → " + node.getFloor() + "층 이동");
            }

            steps.add(step);
            prevNode = node;
        }

        fillDistancePerStep(steps, pathNodeIds);
        return steps;
    }

    private void fillDistancePerStep(List<RouteStepDto> steps, List<Long> pathNodeIds) {

        for (int i = 0; i < pathNodeIds.size() - 1; i++) {
            Long a = pathNodeIds.get(i);
            Long b = pathNodeIds.get(i + 1);

            List<PathEdge> edges = edgeRepo.findByFromNodeIdAndIsActiveTrue(a);
            double distAB = 0.0;

            for (PathEdge e : edges) {
                if (Objects.equals(e.getToNodeId(), b)) {
                    // ⬇ 여기: getDistanceM()
                    distAB = safe(e.getDistanceM());
                    break;
                }
            }

            RouteStepDto nextStep = steps.get(i + 1);
            nextStep.setDistanceMeter(distAB);
        }
    }

    private double calcTotalDistance(List<Long> pathNodeIds, boolean accessibleOnly) {
        double sum = 0.0;

        for (int i = 0; i < pathNodeIds.size() - 1; i++) {
            Long a = pathNodeIds.get(i);
            Long b = pathNodeIds.get(i + 1);

            List<PathEdge> edges = edgeRepo.findByFromNodeIdAndIsActiveTrue(a);

            for (PathEdge e : edges) {
                if (Objects.equals(e.getToNodeId(), b)) {
                    if (accessibleOnly && isNotAccessible(e)) continue;
                    // ⬇ 여기: getDistanceM()
                    sum += safe(e.getDistanceM());
                    break;
                }
            }
        }

        return sum;
    }

    private boolean isNotAccessible(PathEdge e) {
        // 나중에 "계단 금지" 같은 조건 넣을 자리
        return false;
    }

    private double safe(Double v) {
        return v == null ? 0.0 : v;
    }
}
