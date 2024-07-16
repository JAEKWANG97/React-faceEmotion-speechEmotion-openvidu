package io.openvidu.basic.java;

import org.springframework.data.repository.CrudRepository;

public interface RoomRedisRepository extends CrudRepository<Room, String> {
}