package com.readingvault.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.dto.LibroExternoDTO;
import com.readingvault.models.Estanteria;
import com.readingvault.models.Libro;
import com.readingvault.models.LibroEstanteria;
import com.readingvault.repositories.EstanteriaRepository;
import com.readingvault.repositories.LibroEstanteriaRepository;
import com.readingvault.repositories.LibroRepository; // <-- IMPORTANTE

import jakarta.transaction.Transactional;

@Service
public class EstanteriaService {

    @Autowired
    private EstanteriaRepository estanteriaRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private LibroEstanteriaRepository libroEstanteriaRepository;

    public Estanteria crearEstanteria(Estanteria estanteria) {
        return estanteriaRepository.save(estanteria);
    }

    @Transactional
    public void agregarLibroAEstanteria(LibroExternoDTO libroExterno, Long usuarioId, String nombreEstanteria) {
        
        // Buscamos o creamos el libro en la base de datos local
        Libro libroLocal = libroRepository.findByTituloAndAutor(libroExterno.getTitle(), libroExterno.getNombrePrimerAutor())
                .orElseGet(() -> {
                    Libro nuevoLibro = new Libro();
                    nuevoLibro.setTitulo(libroExterno.getTitle());
                    nuevoLibro.setAutor(libroExterno.getNombrePrimerAutor());
                    nuevoLibro.setDescripcion("Páginas: " + libroExterno.getNumberOfPages());
                    nuevoLibro.setFotoPortada(libroExterno.getUrlPortada()); 
                    return libroRepository.save(nuevoLibro);
                });

        // Buscamos la estantería 
        Estanteria estanteria = estanteriaRepository.findByUsuario_IdUsuarioAndNombre(usuarioId, nombreEstanteria)
                .orElseThrow(() -> new RuntimeException("La estantería '" + nombreEstanteria + "' no existe para este usuario"));

        // Evitar duplicados y guardar la relación
        boolean yaExiste = libroEstanteriaRepository.existsByEstanteriaAndLibro(estanteria, libroLocal);
        
        if (!yaExiste) {
            LibroEstanteria relacion = new LibroEstanteria();
            relacion.setEstanteria(estanteria);
            relacion.setLibro(libroLocal);
            // La fecha se pone sola si usaste @PrePersist en el modelo
            libroEstanteriaRepository.save(relacion);
        }
    }
}