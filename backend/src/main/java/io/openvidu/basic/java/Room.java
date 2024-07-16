package io.openvidu.basic.java;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@RedisHash(value = "room1", timeToLive = 1800)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Room {

    @Id
    private String id;
    private String RoomName;
    private LocalDateTime createAt;

    public Room(String roomName) {
        RoomName = roomName;
    }
}
