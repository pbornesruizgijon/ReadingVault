package com.readingvault.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.Estanteria;
import com.readingvault.models.RetoLectura;
import com.readingvault.repositories.EstanteriaRepository;
import com.readingvault.repositories.LibroEstanteriaRepository;
import com.readingvault.repositories.RetoLecturaRepository;

@Service
public class RetoLecturaService {

    @Autowired
    private RetoLecturaRepository retoRepository;
    @Autowired 
    private LibroEstanteriaRepository libroEstanteriaRepository;
    @Autowired 
    private EstanteriaRepository estanteriaRepository;


    // Crear / actualizar el reto del año
    public RetoLectura establecerObjetivo(Long usuarioId, int year, int objetivo) {
        RetoLectura reto = retoRepository.findByUsuario_IdUsuarioAndYear(usuarioId, year)
                .orElse(new RetoLectura());
        
        // Si es nuevo, hay que asignarle el usuario y el año
        if (reto.getIdReto() == null) {
            // Hay que buscar al objeto Usuario por ID o pasarlo
            reto.setYear(year);
        }
        
        reto.setObjetivoLibros(objetivo);
        return retoRepository.save(reto);
    }

    // Calcular progreso real
    public void actualizarProgreso(Long usuarioId, int year) {
        RetoLectura reto = retoRepository.findByUsuario_IdUsuarioAndYear(usuarioId, year)
                .orElseThrow(() -> new RuntimeException("No hay reto para este año"));

        // Buscamos la estantería de Leído del usuario
        Estanteria leidos = estanteriaRepository.findByUsuario_IdUsuarioAndNombre(usuarioId, "LEÍDO")
                .orElseThrow(() -> new RuntimeException("Estantería no encontrada"));

        // Contamos cuántos libros hay en esa estantería cuya fecha es de este año
        // Esto lo podemos hacer con un método en LibroEstanteriaRepository
        long totalCompletados = libroEstanteriaRepository.countByEstanteriaAndFechaAgregadoBetween(
                leidos, 
                LocalDate.of(year, 1, 1), 
                LocalDate.of(year, 12, 31)
        );

        reto.setCompletados((int) totalCompletados);
        retoRepository.save(reto);
    }

    public RetoLectura obtenerRetoPorUsuarioYAnio(Long usuarioId, int year) {
    return retoRepository.findByUsuario_IdUsuarioAndYear(usuarioId, year)
            .orElseThrow(() -> new RuntimeException("No tienes un reto activo para este año"));
}
}