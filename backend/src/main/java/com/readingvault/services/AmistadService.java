package com.readingvault.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.Amistad;
import com.readingvault.repositories.AmistadRepository;

@Service
public class AmistadService {
    @Autowired
    private AmistadRepository amistadRepository;

    public Amistad enviarSolicitud(Amistad amistad) {
        return amistadRepository.save(amistad);
    }

    public List<Amistad> listarAmistades() {
        return amistadRepository.findAll();
    }
}