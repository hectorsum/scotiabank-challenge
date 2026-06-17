package com.periferia.solicitudes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.periferia.solicitudes.dto.SolicitudCreateDTO;
import com.periferia.solicitudes.dto.SolicitudDTO;
import com.periferia.solicitudes.dto.SolicitudPriorityUpdateDTO;
import com.periferia.solicitudes.dto.SolicitudUpdateDTO;
import com.periferia.solicitudes.exception.EntityNotFoundException;
import com.periferia.solicitudes.service.SolicitudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SolicitudController.class)
@DisplayName("SolicitudController - Tests de Integración")
class SolicitudControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SolicitudService service;

    @Autowired
    private ObjectMapper objectMapper;

    private SolicitudDTO solicitudDTO;
    private SolicitudCreateDTO createDTO;
    private SolicitudUpdateDTO updateDTO;
    private SolicitudPriorityUpdateDTO priorityDTO;

    private static final String BASE_URL = "/api/v1/solicitudes";

    @BeforeEach
    void setUp() {
        solicitudDTO = new SolicitudDTO(
                1L, "Actualización de servidor", "Descripción detallada",
                "Juan Pérez", "Software", "alta", "pendiente",
                LocalDateTime.now(), LocalDateTime.now()
        );

        createDTO = new SolicitudCreateDTO(
                "Actualización de servidor", "Descripción detallada",
                "Juan Pérez", "Software", "alta"
        );

        updateDTO = new SolicitudUpdateDTO(
                "Título actualizado", "Descripción actualizada",
                "Hardware", "media", "en revisión"
        );

        priorityDTO = new SolicitudPriorityUpdateDTO("crítica");
    }

    // GET /api/v1/solicitudes
    @Test
    @DisplayName("GET /solicitudes debe retornar 200 con página de solicitudes")
    void debeListarSolicitudesYRetornar200() throws Exception {
        Page<SolicitudDTO> page = new PageImpl<>(List.of(solicitudDTO));
        when(service.listarSolicitudes(anyInt(), anyInt(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Actualización de servidor"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /solicitudes con filtros debe llamar al servicio con parámetros correctos")
    void debeListarSolicitudesConFiltros() throws Exception {
        Page<SolicitudDTO> page = new PageImpl<>(List.of(solicitudDTO));
        when(service.listarSolicitudes(0, 5, "pendiente", "alta", "servidor")).thenReturn(page);

        mockMvc.perform(get(BASE_URL)
                        .param("page", "0")
                        .param("size", "5")
                        .param("status", "pendiente")
                        .param("priority", "alta")
                        .param("search", "servidor"))
                .andExpect(status().isOk());

        verify(service).listarSolicitudes(0, 5, "pendiente", "alta", "servidor");
    }

    @Test
    @DisplayName("GET /solicitudes debe usar valores default de paginación")
    void debeUsarValoresDefaultDePaginacion() throws Exception {
        Page<SolicitudDTO> page = new PageImpl<>(List.of());
        when(service.listarSolicitudes(anyInt(), anyInt(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk());

        verify(service).listarSolicitudes(eq(0), eq(10), isNull(), isNull(), isNull());
    }

    // GET /api/v1/solicitudes/{id}
    @Test
    @DisplayName("GET /solicitudes/{id} debe retornar 200 cuando existe")
    void debeObtenerSolicitudPorIdYRetornar200() throws Exception {
        when(service.obtenerSolicitudPorId(1L)).thenReturn(solicitudDTO);

        mockMvc.perform(get(BASE_URL + "/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Actualización de servidor"))
                .andExpect(jsonPath("$.priority").value("alta"))
                .andExpect(jsonPath("$.status").value("pendiente"));
    }

    @Test
    @DisplayName("GET /solicitudes/{id} debe retornar 404 cuando no existe")
    void debeRetornar404CuandoSolicitudNoExiste() throws Exception {
        when(service.obtenerSolicitudPorId(99L)).thenThrow(new EntityNotFoundException(99L));

        mockMvc.perform(get(BASE_URL + "/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Solicitud con ID 99 no encontrada"));
    }

    // POST /api/v1/solicitudes
    @Test
    @DisplayName("POST /solicitudes debe retornar 201 con solicitud creada")
    void debeCrearSolicitudYRetornar201() throws Exception {
        when(service.crearSolicitud(any())).thenReturn(solicitudDTO);

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Actualización de servidor"))
                .andExpect(jsonPath("$.status").value("pendiente"));
    }

    @Test
    @DisplayName("POST /solicitudes debe retornar 400 cuando título está vacío")
    void debeRetornar400CuandoTituloEsBlank() throws Exception {
        SolicitudCreateDTO invalid = new SolicitudCreateDTO(
                "", "Descripción", "Juan", "Software", "alta"
        );

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.title").exists());
    }

    @Test
    @DisplayName("POST /solicitudes debe retornar 400 cuando prioridad es inválida")
    void debeRetornar400CuandoPrioridadEsInvalida() throws Exception {
        SolicitudCreateDTO invalid = new SolicitudCreateDTO(
                "Título", "Descripción", "Juan", "Software", "INVALIDA"
        );

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.priority").exists());
    }

    @Test
    @DisplayName("POST /solicitudes debe retornar 400 cuando body es vacío")
    void debeRetornar400CuandoBodyEsVacio() throws Exception {
        SolicitudCreateDTO empty = new SolicitudCreateDTO();

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(empty)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors").exists());
    }

    // PUT /api/v1/solicitudes/{id}
    @Test
    @DisplayName("PUT /solicitudes/{id} debe retornar 200 con solicitud actualizada")
    void debeActualizarSolicitudYRetornar200() throws Exception {
        when(service.actualizarSolicitud(eq(1L), any())).thenReturn(solicitudDTO);

        mockMvc.perform(put(BASE_URL + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("PUT /solicitudes/{id} debe retornar 404 cuando no existe")
    void debeRetornar404AlActualizarSolicitudInexistente() throws Exception {
        when(service.actualizarSolicitud(eq(99L), any()))
                .thenThrow(new EntityNotFoundException(99L));

        mockMvc.perform(put(BASE_URL + "/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isNotFound());
    }

    // PATCH /api/v1/solicitudes/{id}/priority
    @Test
    @DisplayName("PATCH /solicitudes/{id}/priority debe retornar 200 con prioridad actualizada")
    void debeActualizarPrioridadYRetornar200() throws Exception {
        when(service.actualizarPrioridad(eq(1L), any())).thenReturn(solicitudDTO);

        mockMvc.perform(patch(BASE_URL + "/1/priority")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(priorityDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("PATCH /solicitudes/{id}/priority debe retornar 400 cuando prioridad es inválida")
    void debeRetornar400CuandoPrioridadPatchEsInvalida() throws Exception {
        SolicitudPriorityUpdateDTO invalid = new SolicitudPriorityUpdateDTO("INVALIDA");

        mockMvc.perform(patch(BASE_URL + "/1/priority")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.priority").exists());
    }

    // DELETE /api/v1/solicitudes/{id}
    @Test
    @DisplayName("DELETE /solicitudes/{id} debe retornar 204 sin body")
    void debeEliminarSolicitudYRetornar204() throws Exception {
        doNothing().when(service).eliminarSolicitud(1L);

        mockMvc.perform(delete(BASE_URL + "/1"))
                .andExpect(status().isNoContent());

        verify(service, times(1)).eliminarSolicitud(1L);
    }

    @Test
    @DisplayName("DELETE /solicitudes/{id} debe retornar 404 cuando no existe")
    void debeRetornar404AlEliminarSolicitudInexistente() throws Exception {
        doThrow(new EntityNotFoundException(99L)).when(service).eliminarSolicitud(99L);

        mockMvc.perform(delete(BASE_URL + "/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
