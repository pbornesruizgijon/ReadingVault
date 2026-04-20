package com.readingvault.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.Estanteria;
import com.readingvault.repositories.EstanteriaRepository;

@Service
public class EstanteriaService {

    @Autowired
    private EstanteriaRepository estanteriaRepository;

    public Estanteria crearEstanteria(Estanteria estanteria) {
        return estanteriaRepository.save(estanteria);
    }
}