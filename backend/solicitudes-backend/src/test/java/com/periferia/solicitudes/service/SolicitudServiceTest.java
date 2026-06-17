package com.periferia.solicitudes.service;

import com.periferia.solicitudes.dto.SolicitudCreateDTO;
import com.periferia.solicitudes.dto.SolicitudDTO;
import com.periferia.solicitudes.dto.SolicitudPriorityUpdateDTO;
import com.periferia.solicitudes.dto.SolicitudUpdateDTO;
import com.periferia.solicitudes.entity.Solicitud;
import com.periferia.solicitudes.entity.enums.Category;
import com.periferia.solicitudes.entity.enums.Priority;
import com.periferia.solicitudes.entity.enums.Status;
import com.periferia.solicitudes.exception.EntityNotFoundException;
import com.periferia.solicitudes.mapper.SolicitudMapper;
import com.periferia.solicitudes.repository.SolicitudRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SolicitudService - Tests Unitarios")
class SolicitudServiceTest {

    @Mock
    private SolicitudRepository repository;

    @Mock
    private SolicitudMapper mapper;

    @InjectMocks
    private SolicitudService service;

    private Solicitud solicitud;
    private SolicitudDTO solicitudDTO;
    private SolicitudCreateDTO createDTO;
    private SolicitudUpdateDTO updateDTO;
    private SolicitudPriorityUpdateDTO priorityDTO;

    @BeforeEach
    void setUp() {
        solicitud = Solicitud.builder()
                .id(1L)
                .title("Actualización de servidor")
                .description("Descripción detallada del problema")
                .requester("Juan Pérez")
                .category(Category.SOFTWARE)
                .priority(Priority.ALTA)
                .status(Status.PENDIENTE)
                .build();

        solicitudDTO = new SolicitudDTO(
                1L, "Actualización de servidor", "Descripción detallada del problema",
                "Juan Pérez", "Software", "alta", "pendiente",
                LocalDateTime.now(), LocalDateTime.now()
        );

        createDTO = new SolicitudCreateDTO(
                "Actualización de servidor", "Descripción detallada del problema",
                "Juan Pérez", "Software", "alta"
        );

        updateDTO = new SolicitudUpdateDTO(
                "Título actualizado", "Descripción actualizada",
                "Hardware", "media", "en revisión"
        );

        priorityDTO = new SolicitudPriorityUpdateDTO("crítica");
    }

    // -------------------------------------------------------------------------
    // crearSolicitud
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Debe crear solicitud exitosamente y retornar DTO")
    void debeCrearSolicitudExitosamente() {
        when(mapper.toEntity(createDTO)).thenReturn(solicitud);
        when(repository.save(solicitud)).thenReturn(solicitud);
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        SolicitudDTO result = service.crearSolicitud(createDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Actualización de servidor", result.getTitle());
        assertEquals("pendiente", result.getStatus());
        verify(repository, times(1)).save(solicitud);
        verify(mapper, times(1)).toEntity(createDTO);
        verify(mapper, times(1)).toDTO(solicitud);
    }

    @Test
    @DisplayName("Debe llamar al mapper antes de guardar en repository")
    void debeUsarMapperAntesDeGuardar() {
        when(mapper.toEntity(createDTO)).thenReturn(solicitud);
        when(repository.save(solicitud)).thenReturn(solicitud);
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        service.crearSolicitud(createDTO);

        var order = inOrder(mapper, repository);
        order.verify(mapper).toEntity(createDTO);
        order.verify(repository).save(solicitud);
        order.verify(mapper).toDTO(solicitud);
    }

    // obtenerSolicitudPorId
    @Test
    @DisplayName("Debe retornar DTO cuando el ID existe")
    void debeObtenerSolicitudPorIdExistente() {
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        SolicitudDTO result = service.obtenerSolicitudPorId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("alta", result.getPriority());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException cuando el ID no existe")
    void debeLanzarExcepcionCuandoIdNoExiste() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(
                EntityNotFoundException.class,
                () -> service.obtenerSolicitudPorId(99L)
        );

        assertTrue(ex.getMessage().contains("99"));
        verify(repository, times(1)).findById(99L);
    }

    // listarSolicitudes
    @Test
    @DisplayName("Debe retornar página de solicitudes sin filtros")
    void debeListarSolicitudesSinFiltros() {
        Page<Solicitud> page = new PageImpl<>(List.of(solicitud));
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        Page<SolicitudDTO> result = service.listarSolicitudes(0, 10, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
    }

    @Test
    @DisplayName("Debe aplicar paginación correctamente")
    void debeAplicarPaginacion() {
        Page<Solicitud> page = new PageImpl<>(List.of(solicitud));
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        Page<SolicitudDTO> result = service.listarSolicitudes(0, 5, null, null, null);

        assertNotNull(result);
        verify(repository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    @DisplayName("Debe retornar página vacía cuando no hay solicitudes")
    void debeRetornarPaginaVaciaSinSolicitudes() {
        Page<Solicitud> emptyPage = new PageImpl<>(List.of());
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(emptyPage);

        Page<SolicitudDTO> result = service.listarSolicitudes(0, 10, null, null, null);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
    }

    // actualizarSolicitud
    @Test
    @DisplayName("Debe actualizar solicitud existente exitosamente")
    void debeActualizarSolicitudExitosamente() {
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(repository.save(solicitud)).thenReturn(solicitud);
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        SolicitudDTO result = service.actualizarSolicitud(1L, updateDTO);

        assertNotNull(result);
        verify(mapper, times(1)).updateEntity(updateDTO, solicitud);
        verify(repository, times(1)).save(solicitud);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar solicitud inexistente")
    void debeLanzarExcepcionAlActualizarSolicitudInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> service.actualizarSolicitud(99L, updateDTO));

        verify(mapper, never()).updateEntity(any(), any());
        verify(repository, never()).save(any());
    }

    // actualizarPrioridad
    @Test
    @DisplayName("Debe actualizar solo la prioridad de la solicitud")
    void debeActualizarPrioridadExitosamente() {
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(repository.save(solicitud)).thenReturn(solicitud);
        when(mapper.toDTO(solicitud)).thenReturn(solicitudDTO);

        SolicitudDTO result = service.actualizarPrioridad(1L, priorityDTO);

        assertNotNull(result);
        verify(mapper, times(1)).updatePriority(priorityDTO, solicitud);
        verify(mapper, never()).updateEntity(any(), any());
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar prioridad de solicitud inexistente")
    void debeLanzarExcepcionAlActualizarPrioridadInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> service.actualizarPrioridad(99L, priorityDTO));

        verify(mapper, never()).updatePriority(any(), any());
    }

    // eliminarSolicitud
    @Test
    @DisplayName("Debe eliminar solicitud existente sin retornar nada")
    void debeEliminarSolicitudExitosamente() {
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));

        assertDoesNotThrow(() -> service.eliminarSolicitud(1L));

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar solicitud inexistente")
    void debeLanzarExcepcionAlEliminarSolicitudInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> service.eliminarSolicitud(99L));

        verify(repository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Debe buscar la solicitud antes de eliminar")
    void debeBuscarAntesDeEliminar() {
        when(repository.findById(1L)).thenReturn(Optional.of(solicitud));

        service.eliminarSolicitud(1L);

        var order = inOrder(repository);
        order.verify(repository).findById(1L);
        order.verify(repository).deleteById(1L);
    }
}
