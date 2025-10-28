package ac.kr.inhatc.campus.nav.repository;

import ac.kr.inhatc.campus.nav.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByBuildingId(Long buildingId);
    List<Room> findByBuildingIdAndFloor(Long buildingId, Integer floor);
    List<Room> findByRoomCode(String roomCode);
    Optional<Room> findById(Long id);
    List<Room> findByNameContainingIgnoreCase(String keyword);
}

