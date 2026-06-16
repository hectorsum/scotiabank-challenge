package com.periferia.solicitudes.dto;

import com.periferia.solicitudes.entity.enums.Category;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.validation.ValidEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SolicitudCreateDTO {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100, message = "El título no puede superar los 100 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
    private String description;

    @NotBlank(message = "El solicitante es obligatorio")
    @Size(max = 100, message = "El solicitante no puede superar los 100 caracteres")
    private String requester;

    @NotBlank(message = "La categoría es obligatoria")
    @ValidEnum(enumClass = Category.class,
               message = "Categoría inválida. Valores: Infraestructura, Software, Hardware, Redes, Soporte Técnico")
    private String category;

    @NotBlank(message = "La prioridad es obligatoria")
    @ValidEnum(enumClass = Priority.class,
               message = "Prioridad inválida. Valores: baja, media, alta, crítica")
    private String priority;

    public SolicitudCreateDTO() {}

    public SolicitudCreateDTO(String title, String description, String requester,
                               String category, String priority) {
        this.title = title;
        this.description = description;
        this.requester = requester;
        this.category = category;
        this.priority = priority;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRequester() { return requester; }
    public String getCategory() { return category; }
    public String getPriority() { return priority; }
}
