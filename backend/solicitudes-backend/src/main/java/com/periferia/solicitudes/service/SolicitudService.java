package com.periferia.solicitudes.service;

import com.periferia.solicitudes.dto.SolicitudCreateDTO;
import com.periferia.solicitudes.dto.SolicitudDTO;
import com.periferia.solicitudes.dto.SolicitudPriorityUpdateDTO;
import com.periferia.solicitudes.dto.SolicitudUpdateDTO;
import com.periferia.solicitudes.entity.Solicitud;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import com.periferia.solicitudes.exception.EntityNotFoundException;
import com.periferia.solicitudes.mapper.SolicitudMapper;
import com.periferia.solicitudes.repository.SolicitudRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SolicitudService {

    private static final Logger log = LoggerFactory.getLogger(SolicitudService.class);

    private final SolicitudRepository repository;
    private final SolicitudMapper mapper;

    public SolicitudService(SolicitudRepository repository, SolicitudMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public SolicitudDTO crearSolicitud(SolicitudCreateDTO dto) {
        log.info("Creando solicitud: título='{}'", dto.getTitle());
        Solicitud guardada = repository.save(mapper.toEntity(dto));
        log.info("Solicitud creada con ID={}", guardada.getId());
        return mapper.toDTO(guardada);
    }

    @Transactional(readOnly = true)
    public SolicitudDTO obtenerSolicitudPorId(Long id) {
        log.info("Buscando solicitud ID={}", id);
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> {
                    log.warn("Solicitud ID={} no encontrada", id);
                    return new EntityNotFoundException(id);
                });
    }

    @Transactional(readOnly = true)
    public Page<SolicitudDTO> listarSolicitudes(int page, int size, String status, String priority, String search) {
        log.info("Listando solicitudes: página={}, tamaño={}, status='{}', priority='{}', search='{}'", page, size, status, priority, search);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "creationDate"));
        return repository.findAll(buildFiltros(status, priority, search), pageable)
                .map(mapper::toDTO);
    }

    public SolicitudDTO actualizarSolicitud(Long id, SolicitudUpdateDTO dto) {
        log.info("Actualizando solicitud ID={}", id);
        Solicitud solicitud = buscarOLanzar(id);
        mapper.updateEntity(dto, solicitud);
        log.info("Solicitud ID={} actualizada", id);
        return mapper.toDTO(repository.save(solicitud));
    }

    public SolicitudDTO actualizarPrioridad(Long id, SolicitudPriorityUpdateDTO dto) {
        log.info("Actualizando prioridad de solicitud ID={} a '{}'", id, dto.getPriority());
        Solicitud solicitud = buscarOLanzar(id);
        mapper.updatePriority(dto, solicitud);
        return mapper.toDTO(repository.save(solicitud));
    }

    public void eliminarSolicitud(Long id) {
        log.info("Eliminando solicitud ID={}", id);
        buscarOLanzar(id);
        repository.deleteById(id);
        log.info("Solicitud ID={} eliminada", id);
    }

    // Métodos privados

    private Solicitud buscarOLanzar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Solicitud ID={} no encontrada", id);
                    return new EntityNotFoundException(id);
                });
    }

    private Specification<Solicitud> buildFiltros(String status, String priority, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null && !status.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("status"), Status.fromLabel(status)));
                } catch (IllegalArgumentException e) {
                    log.warn("Valor de status ignorado en filtro: '{}'", status);
                }
            }

            if (priority != null && !priority.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("priority"), Priority.fromLabel(priority)));
                } catch (IllegalArgumentException e) {
                    log.warn("Valor de priority ignorado en filtro: '{}'", priority);
                }
            }

            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
