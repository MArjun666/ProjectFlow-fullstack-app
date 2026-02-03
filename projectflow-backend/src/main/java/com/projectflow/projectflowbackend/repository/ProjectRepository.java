package com.projectflow.projectflowbackend.repository;

import com.projectflow.projectflowbackend.domain.Project;
import com.projectflow.projectflowbackend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    // This replaces the broken @Query and handles DBRefs correctly
    List<Project> findByUserOrProjectManagerOrTeamMembersContaining(User user, User pm, User member);
}