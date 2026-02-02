<?php

class ClienteMensaje implements JsonSerializable
{
    public int $id;
    public int $idCliente;
    public int $idMensaje;
    public bool $contestado;
    public int $idAdmin;

    public function __construct(
        int $id,
        int $idCliente,
        int $idMensaje,
        bool $contestado,
        int $idAdmin
    ) {
        $this->id = $id;
        $this->idCliente = $idCliente;
        $this->idMensaje = $idMensaje;
        $this->contestado = $contestado;
        $this->idAdmin = $idAdmin;
    }
}
