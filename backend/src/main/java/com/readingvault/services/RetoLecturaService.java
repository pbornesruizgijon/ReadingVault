package com.readingvault.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.RetoLectura;
import com.readingvault.repositories.RetoLecturaRepository;

@Service
public class RetoLecturaService {

    @Autowired
    private RetoLecturaRepository retoRepository;

    public RetoLectura actualizarProgreso(RetoLectura reto) {
        return retoRepository.save(reto);
    }
}