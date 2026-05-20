package com.readingvault.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.readingvault.models.Genero;
import com.readingvault.models.Usuario;
import com.readingvault.repositories.GeneroRepository;
import com.readingvault.repositories.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GeneroRepository generoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // POBLAR GÉNEROS
        if (generoRepository.count() == 0) {
            List<Genero> generos = List.of(
                new Genero("Arte", "Art"),
                new Genero("Autoayuda", "Self-Help"),
                new Genero("Biografía", "Biography & Autobiography"),
                new Genero("Ciencia Ficción", "Fiction / Science Fiction"),
                new Genero("Clásicos", "Fiction / Classics"),
                new Genero("Crimen", "True Crime"),
                new Genero("Fantasía", "Fiction / Fantasy"),
                new Genero("Ficción", "Fiction"),
                new Genero("Historia", "History"),
                new Genero("Comedia", "Fiction / Humorous"),
                new Genero("Infantil", "Juvenile Fiction"),
                new Genero("Misterio", "Fiction / Mystery & Detective"),
                new Genero("Paranormal", "Fiction / Paranormal"),
                new Genero("Poesía", "Poetry"),
                new Genero("Romance", "Fiction / Romance"),
                new Genero("Suspense", "Fiction / Suspense"),
                new Genero("Terror", "Fiction / Horror"),
                new Genero("Thriller", "Fiction / Thriller")
            );

            generoRepository.saveAll(generos);
            System.out.println(">> Géneros oficiales de Google Books inicializados correctamente.");
        }

        // CREAR ADMINISTRADOR POR DEFECTO
        if (usuarioRepository.findByEmail("admin@readingvault.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setApellidos("Global");
            admin.setNombreUsuario("admin");
            admin.setEmail("admin@readingvault.com");
            
            // Encriptamos la contraseña "admin123"
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol("ADMIN"); 
            admin.setObjetivoLectura(50);
            admin.setFechaRegistro(LocalDate.now().toString());

            usuarioRepository.save(admin);
            System.out.println(">> Usuario Administrador inicializado correctamente (admin@readingvault.com).");
        }
    }
}