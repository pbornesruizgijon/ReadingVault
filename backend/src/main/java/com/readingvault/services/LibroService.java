package com.readingvault.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.Libro;
import com.readingvault.repositories.LibroRepository;

@Service
public class LibroService {

    @Autowired
    private LibroRepository libroRepository;

    /**
     * Sincroniza los libros que vienen de la API externa con los datos locales.
     * Si un libro ya existe en nuestra BD (por ISBN), usamos nuestra valoración y votos.
     */
    public List<Libro> enriquecerLibrosConDatosLocales(List<Libro> librosExternos) {
        for (Libro libroExt : librosExternos) {
            if (libroExt.getIsbn() != null) {
                libroRepository.findByIsbn(libroExt.getIsbn()).ifPresent(libroLocal -> {
                    // Sobrescribimos con los datos de nuestra comunidad
                    libroExt.setIdLibro(libroLocal.getIdLibro());
                    libroExt.setValoracion(libroLocal.getValoracion());
                    libroExt.setVotos(libroLocal.getVotos());
                });
            }
        }
        return librosExternos;
    }

    public Libro obtenerOCrearPorIsbn(Libro datos) {
        return libroRepository.findByIsbn(datos.getIsbn())
            .orElseGet(() -> libroRepository.save(datos));
    }

    public List<Libro> listarTodos() {
        return libroRepository.findAll();
    }

    public Libro guardarLibro(Libro libro) {
        return libroRepository.save(libro);
    }
}