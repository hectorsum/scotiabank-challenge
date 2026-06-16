package com.periferia.solicitudes.entity;

import com.periferia.solicitudes.entity.enums.Category;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false, length = 100)
    private String requester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creationDate;

    @UpdateTimestamp
    private LocalDateTime lastChangeDate;

    public Solicitud() {}

    public Solicitud(Long id, String title, String description, String requester,
                     Category category, Priority priority, Status status,
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
    public Category getCategory() { return category; }
    public Priority getPriority() { return priority; }
    public Status getStatus() { return status; }
    public LocalDateTime getCreationDate() { return creationDate; }
    public LocalDateTime getLastChangeDate() { return lastChangeDate; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setRequester(String requester) { this.requester = requester; }
    public void setCategory(Category category) { this.category = category; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public void setStatus(Status status) { this.status = status; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private String requester;
        private Category category;
        private Priority priority;
        private Status status;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder requester(String requester) { this.requester = requester; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder priority(Priority priority) { this.priority = priority; return this; }
        public Builder status(Status status) { this.status = status; return this; }

        public Solicitud build() {
            Solicitud s = new Solicitud();
            s.id = this.id;
            s.title = this.title;
            s.description = this.description;
            s.requester = this.requester;
            s.category = this.category;
            s.priority = this.priority;
            s.status = this.status;
            return s;
        }
    }
}
