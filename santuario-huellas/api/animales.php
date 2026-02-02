<?php

class Animales implements JsonSerializable {
    public int $id;
    public string $nombre;
    public string $descripcion;
    public string $historia;
    public string $especie;
    public int $edad;
    public bool $esterilizado;
    public string $microchip;
    public string $sexo;
    public string $tamano;
    public bool $vacunas;
    public string $raza;
    public string $foto;
    public string $fechaCreacion;
    public string $fechaAdopcion;

    public function __construct(int $id, string $nombre, string $descripcion, string $historia, string $especie, int $edad, bool $esterilizado, string $microchip, string $sexo, string $tamano, bool $vacunas,string $raza, string $foto,string $fechaCreacion, string $fechaAdopcion){
        $this->id = $id;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->historia = $historia;
        $this->especie = $especie;
        $this->edad = $edad;
        $this->esterilizado = $esterilizado;
        $this->microchip = $microchip;
        $this->sexo = $sexo;
        $this->tamano = $tamano;
        $this->vacunas = $vacunas;
        $this->raza = $raza;
        $this->foto = $foto;
        $this->fechaCreacion = $fechaCreacion;
        $this->fechaAdopcion = $fechaAdopcion;
    }
    
}
