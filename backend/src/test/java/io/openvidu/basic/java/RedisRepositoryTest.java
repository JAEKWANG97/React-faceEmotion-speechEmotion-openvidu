package io.openvidu.basic.java;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class RedisRepositoryTest {

    @Autowired
    private RoomRedisRepository repository;


    @Test
    void test() {
        Room room = new Room("DoYeol");

        // 저장
        repository.save(room);

        // `keyspace:id` 값을 가져옴
        Room room1 = repository.findById(room.getId()).get();
        
        // Person Entity 의 @RedisHash 에 정의되어 있는 keyspace (people) 에 속한 키의 갯수를 구함
//        repository.count();
//        log.info("Room:{}", repository.find);
//        Assertions.assertThat(repository.count()).isEqualTo(1);
        // 삭제
//        repository.delete(room);
    }
}
