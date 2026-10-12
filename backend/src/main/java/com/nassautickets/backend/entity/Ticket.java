package com.nassautickets.backend.entity;

import com.nassautickets.backend.enums.StatusTicket;
import com.nassautickets.backend.enums.TipoTicket;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "SENHA")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_senha")
    private Integer numero;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoTicket tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private StatusTicket estado;

    @Column(name = "data_emissao")
    private LocalDateTime dataEmissao = LocalDateTime.now();

    public String getDataEmissaoFormatada(){
        DateTimeFormatter fmt1 =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return dataEmissao.format(fmt1);
    }
}
