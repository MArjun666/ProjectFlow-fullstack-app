package com.projectflow.projectflowbackend.dto;

import com.projectflow.projectflowbackend.domain.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {
    private String _id;
    private String name;
    private String email;
    private String role;
    private String avatar;

    public UserResponse(User user) {
        if (user != null) {
            this._id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole().name();
            this.avatar = user.getAvatar();
        }
    }
}