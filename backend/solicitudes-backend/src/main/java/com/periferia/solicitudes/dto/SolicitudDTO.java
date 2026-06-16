package com.periferia.solicitudes.dto;

import java.time.LocalDateTime;

public class SolicitudDTO {
    private Long id;
    private String title;
    private String description;
    private String requester;
    private String category;
    private String priority;
    private String status;
    private LocalDateTime creationDate;
    private LocalDateTime lastChangeDate;

    public SolicitudDTO() {}

    public SolicitudDTO(Long id, String title, String description, String requester,
                        String category, String priority, String status,
                        LocalDateTime creationDate, LocalDateTime lastChangeDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.requester = requester;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.creationDate = creationDate;
        this.lastChangeDate = lastChangeDate;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRequester() { return requester; }
    public String getCategory() { return category; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public LocalDateTime getCreationDate() { return creationDate; }
    public LocalDateTime getLastChangeDate() { return lastChangeDate; }
}
