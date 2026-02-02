<?php

class Mensajes implements JsonSerializable
{
    public int $id;
    public string $motivo;
    public string $mensaje;
    public int $idAnimal;
    public string $fechaEnvio;

    public function __construct(int $id, string $motivo, string $mensaje, string $idAnimal, string $fechaEnvio) {
        $this->id = $id;
        $this->motivo = $motivo;
        $this->mensaje = $mensaje;
        $this->idAnimal = $idAnimal;
        $this->fechaEnvio = $fechaEnvio;
    }

}
