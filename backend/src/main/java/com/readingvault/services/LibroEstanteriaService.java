package com.readingvault.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.LibroEstanteria;
import com.readingvault.repositories.LibroEstanteriaRepository;

@Service
public class LibroEstanteriaService {

    @Autowired
    private LibroEstanteriaRepository libroEstanteriaRepository;

    public LibroEstanteria agregarLibroAEstanteria(LibroEstanteria relacion) {
        // Guarda la relación entre un libro y una estantería
        return libroEstanteriaRepository.save(relacion);
    }

    public List<LibroEstanteria> obtenerLibrosDeEstanteria(Long idEstanteria) {
        return libroEstanteriaRepository.findByEstanteriaIdEstanteria(idEstanteria);
    }
}