package com.readingvault.services;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service; // IMPORTANTE

import com.readingvault.models.Usuario;
import com.readingvault.repositories.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el triturador

    public Usuario registrarUsuario(Usuario usuario) {
        // Ciframos la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // Guardamos al usuario con la contraseña ya protegida
        return usuarioRepository.save(usuario);
    }

    public Usuario guardarSinEncriptar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // busquedas
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }

    public Usuario actualizarPerfil(Long id, Usuario datosNuevos) throws Exception {
        Usuario userExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        // 1. Validar que el nuevo username no lo tenga OTRO usuario
        if (!userExistente.getNombreUsuario().equals(datosNuevos.getNombreUsuario())) {
            if (usuarioRepository.existsByNombreUsuario(datosNuevos.getNombreUsuario())) {
                throw new Exception("El nombre de usuario ya está en uso");
            }
        }

        // 2. Validar que el nuevo email no lo tenga OTRO usuario
        if (!userExistente.getEmail().equals(datosNuevos.getEmail())) {
            if (usuarioRepository.existsByEmail(datosNuevos.getEmail())) {
                throw new Exception("El correo ya está registrado");
            }
        }

        // 3. Gestión de contraseña: Solo se encripta si el usuario escribe una nueva
        if (datosNuevos.getPassword() != null && !datosNuevos.getPassword().trim().isEmpty()) {
            userExistente.setPassword(passwordEncoder.encode(datosNuevos.getPassword()));
        }

        // 4. Actualizar el resto de campos
        userExistente.setNombre(datosNuevos.getNombre());
        userExistente.setApellidos(datosNuevos.getApellidos());
        userExistente.setFechaNacimiento(datosNuevos.getFechaNacimiento());
        userExistente.setLocalidad(datosNuevos.getLocalidad());
        userExistente.setBiografia(datosNuevos.getBiografia());
        userExistente.setNombreUsuario(datosNuevos.getNombreUsuario());
        userExistente.setEmail(datosNuevos.getEmail());

        // Si tienes la relación con género:
        if (datosNuevos.getGenero() != null) {
            userExistente.setGenero(datosNuevos.getGenero());
        }

        return usuarioRepository.save(userExistente);
    }

    public Usuario actualizarPrivacidad(Long id, Map<String, String> ajustes) throws Exception {
        Usuario user = usuarioRepository.findById(id).orElseThrow();

        user.setPrivacidadPerfil(ajustes.get("perfil"));
        user.setPrivacidadLibros(ajustes.get("libros"));
        user.setPrivacidadAmigos(ajustes.get("amigos"));
        user.setPrivacidadDatos(ajustes.get("datosPersonales"));

        return usuarioRepository.save(user);
    }

    @Transactional 
    public void eliminar(Long id) {
        //si da error es porque no tenemos CascadeType.ALL
        usuarioRepository.deleteById(id);
    }

}