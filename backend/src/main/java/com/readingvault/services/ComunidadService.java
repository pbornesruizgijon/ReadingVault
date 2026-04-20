package com.readingvault.services;

import com.readingvault.models.Comunidad;
import com.readingvault.models.MensajeComunidad;
import com.readingvault.repositories.ComunidadRepository;
import com.readingvault.repositories.MensajeComunidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComunidadService {

    @Autowired
    private ComunidadRepository comunidadRepository;

    @Autowired
    private MensajeComunidadRepository mensajeRepository;

    public List<Comunidad> listarComunidades() {
        return comunidadRepository.findAll();
    }

    public MensajeComunidad enviarMensaje(MensajeComunidad mensaje) {
        return mensajeRepository.save(mensaje);
    }
}