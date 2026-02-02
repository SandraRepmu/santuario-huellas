<?php

class Administradores implements JsonSerializable
{
    public int $id;
    public string $usuario;
    public string $contrasena;

    public function __construct(int $id, string $usuario, string $contrasena) {
        $this->id = $id;
        $this->usuario = $usuario;
        $this->contrasena = $contrasena;
    }
}
