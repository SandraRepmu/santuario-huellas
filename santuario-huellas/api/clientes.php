<?php

class Clientes implements JsonSerializable
{
    public int $id;
    public string $nombreApellidos;
    public string $email;
    public string $telefono;

    public function __construct(int $id, string $nombreApellidos, string $email,string $telefono) {
        $this->id = $id;
        $this->nombreApellidos = $nombreApellidos;
        $this->email = $email;
        $this->telefono = $telefono;
    }
    
}
