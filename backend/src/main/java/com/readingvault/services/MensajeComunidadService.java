package com.readingvault.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.MensajeComunidad;
import com.readingvault.repositories.MensajeComunidadRepository;

@Service
public class MensajeComunidadService {

    @Autowired
    private MensajeComunidadRepository mensajeRepository;

    // Publicar un mensaje en el foro
    public MensajeComunidad enviarMensaje(MensajeComunidad mensaje) {
        return mensajeRepository.save(mensaje);
    }

    // Cargar el historial de mensajes de un club específico
    public List<MensajeComunidad> obtenerMensajesPorComunidad(Long idComunidad) {
        return mensajeRepository.findByComunidadIdComunidad(idComunidad);
    }
}