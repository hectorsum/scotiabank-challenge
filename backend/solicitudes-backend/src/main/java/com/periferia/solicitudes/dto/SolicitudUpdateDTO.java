package com.periferia.solicitudes.dto;

import com.periferia.solicitudes.entity.enums.Category;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import com.periferia.solicitudes.validation.ValidEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SolicitudUpdateDTO {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100, message = "El título no puede superar los 100 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
    private String description;

    @NotBlank(message = "La categoría es obligatoria")
    @ValidEnum(enumClass = Category.class,
               message = "Categoría inválida. Valores: Infraestructura, Software, Hardware, Redes, Soporte Técnico")
    private String category;

    @NotBlank(message = "La prioridad es obligatoria")
    @ValidEnum(enumClass = Priority.class,
               message = "Prioridad inválida. Valores: baja, media, alta, crítica")
    private String priority;

    @NotBlank(message = "El estado es obligatorio")
    @ValidEnum(enumClass = Status.class,
               message = "Estado inválido. Valores: pendiente, en revisión, aprobada, rechazada, cerrada")
    private String status;

    public SolicitudUpdateDTO() {}

    public SolicitudUpdateDTO(String title, String description, String category,
                               String priority, String status) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
}
