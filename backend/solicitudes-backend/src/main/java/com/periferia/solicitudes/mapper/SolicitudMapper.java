package com.periferia.solicitudes.mapper;

import com.periferia.solicitudes.dto.SolicitudCreateDTO;
import com.periferia.solicitudes.dto.SolicitudDTO;
import com.periferia.solicitudes.dto.SolicitudUpdateDTO;
import com.periferia.solicitudes.entity.Solicitud;
import com.periferia.solicitudes.entity.enums.Category;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import org.springframework.stereotype.Component;

@Component
public class SolicitudMapper {

    public SolicitudDTO toDTO(Solicitud entity) {
        return new SolicitudDTO(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getRequester(),
                entity.getCategory().getLabel(),
                entity.getPriority().getLabel(),
                entity.getStatus().getLabel(),
                entity.getCreationDate(),
                entity.getLastChangeDate()
        );
    }

    public Solicitud toEntity(SolicitudCreateDTO dto) {
        return Solicitud.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requester(dto.getRequester())
                .category(Category.fromLabel(dto.getCategory()))
                .priority(Priority.fromLabel(dto.getPriority()))
                .status(Status.PENDIENTE)
                .build();
    }

    public void updateEntity(SolicitudUpdateDTO dto, Solicitud entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setCategory(Category.fromLabel(dto.getCategory()));
        entity.setPriority(Priority.fromLabel(dto.getPriority()));
        entity.setStatus(Status.fromLabel(dto.getStatus()));
    }
}
