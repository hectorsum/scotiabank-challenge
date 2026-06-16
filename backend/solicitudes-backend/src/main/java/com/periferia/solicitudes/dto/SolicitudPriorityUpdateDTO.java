package com.periferia.solicitudes.dto;

import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.validation.ValidEnum;
import jakarta.validation.constraints.NotBlank;

public class SolicitudPriorityUpdateDTO {

    @NotBlank(message = "La prioridad es obligatoria")
    @ValidEnum(enumClass = Priority.class,
               message = "Prioridad inválida. Valores: baja, media, alta, crítica")
    private String priority;

    public SolicitudPriorityUpdateDTO() {}

    public SolicitudPriorityUpdateDTO(String priority) {
        this.priority = priority;
    }

    public String getPriority() { return priority; }
}
