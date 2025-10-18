package com.projectflow.projectflowbackend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter 
@Setter
public class ProjectRequest {
    private String name;
    private String description;
    private String status;
    private String projectManager;
    private List<String> teamMembers;
    private String startDate;
    private String endDate;
    private String clientName;
    private String clientEmail;
    private String clientCompany;
}
