package com.readingvault.services;

import com.readingvault.models.Usuario;
import com.readingvault.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos para pruebas
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Guardar usuario (Registro)
    public Usuario guardarUsuario(Usuario usuario) {
        // Aquí podrías añadir lógica para cifrar la contraseña más adelante
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}