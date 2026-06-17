package com.periferia.solicitudes.controller;

import com.periferia.solicitudes.dto.SolicitudCreateDTO;
import com.periferia.solicitudes.dto.SolicitudDTO;
import com.periferia.solicitudes.dto.SolicitudPriorityUpdateDTO;
import com.periferia.solicitudes.dto.SolicitudUpdateDTO;
import com.periferia.solicitudes.service.SolicitudService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/solicitudes")
public class SolicitudController {

    private static final Logger log = LoggerFactory.getLogger(SolicitudController.class);

    private final SolicitudService service;

    public SolicitudController(SolicitudService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<SolicitudDTO>> listarSolicitudes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search) {
        log.info("GET /api/v1/solicitudes - página={}, tamaño={}", page, size);
        return ResponseEntity.ok(service.listarSolicitudes(page, size, status, priority, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudDTO> obtenerSolicitudPorId(@PathVariable Long id) {
        log.info("GET /api/v1/solicitudes/{} - Obteniendo solicitud", id);
        return ResponseEntity.ok(service.obtenerSolicitudPorId(id));
    }

    @PostMapping
    public ResponseEntity<SolicitudDTO> crearSolicitud(@Valid @RequestBody SolicitudCreateDTO dto) {
        log.info("POST /api/v1/solicitudes - Creando nueva solicitud");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crearSolicitud(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitudDTO> actualizarSolicitud(
            @PathVariable Long id,
            @Valid @RequestBody SolicitudUpdateDTO dto) {
        log.info("PUT /api/v1/solicitudes/{} - Actualizando solicitud", id);
        return ResponseEntity.ok(service.actualizarSolicitud(id, dto));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<SolicitudDTO> actualizarPrioridad(
            @PathVariable Long id,
            @Valid @RequestBody SolicitudPriorityUpdateDTO dto) {
        log.info("PATCH /api/v1/solicitudes/{}/priority - Actualizando prioridad", id);
        return ResponseEntity.ok(service.actualizarPrioridad(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSolicitud(@PathVariable Long id) {
        log.info("DELETE /api/v1/solicitudes/{} - Eliminando solicitud", id);
        service.eliminarSolicitud(id);
        return ResponseEntity.noContent().build();
    }
}
