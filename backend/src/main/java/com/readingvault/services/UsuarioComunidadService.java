package com.readingvault.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.UsuarioComunidad;
import com.readingvault.repositories.UsuarioComunidadRepository;

@Service
public class UsuarioComunidadService {

    @Autowired
    private UsuarioComunidadRepository usuarioComunidadRepository;

    // Unirse a una comunidad
    public UsuarioComunidad unirseAComunidad(UsuarioComunidad relacion) {
        return usuarioComunidadRepository.save(relacion);
    }

    // Listar todos los miembros de todas las comunidades (para administración)
    public List<UsuarioComunidad> obtenerTodasLasRelaciones() {
        return usuarioComunidadRepository.findAll();
    }
}