package com.projectflow.projectflowbackend.repository;

import com.projectflow.projectflowbackend.domain.Project;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {

    @Query("{ '$or': [ { 'user.$id': ?0 }, { 'projectManager.$id': ?0 }, { 'teamMembers.$id': ?0 } ] }")
    List<Project> findProjectsByUserId(ObjectId userId);
}