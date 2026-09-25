import { z } from "zod";

export const non_empty_string = z.string().trim().min(1);

export const sala_id_schema = non_empty_string;
export const mesa_id_schema = non_empty_string;
export const conta_id_schema = non_empty_string;

/** GET query schemas */
export const sala_id_query = z.object({
  salaId: sala_id_schema,
});

export const mesa_sala_query = z.object({
  salaId: sala_id_schema,
});

export const mesa_load_query = z.object({
  salaId: sala_id_schema,
  mesaId: mesa_id_schema,
});

export const conta_mesa_query = z.object({
  mesaId: mesa_id_schema,
});

export const conta_load_query = z.object({
  mesaId: mesa_id_schema,
  contaId: conta_id_schema,
});

/** POST/PUT/DELETE body schemas */
export const sala_store_body = z.object({
  salaDTO: z.object({
    salaId: sala_id_schema,
    nome: non_empty_string,
  }),
});

export const sala_set_body = z.object({
  salaId: sala_id_schema,
  key: non_empty_string,
  value: z.unknown(),
});

export const mesa_store_body = z.object({
  mesaDTO: z.object({
    mesaId: mesa_id_schema,
    salaId: sala_id_schema,
    nomeMesa: non_empty_string,
    estado: z.enum(["livre", "ocupada"]),
    obs: z.string(),
  }),
});

export const mesa_set_body = z.object({
  salaId: sala_id_schema,
  mesaId: mesa_id_schema,
  key: non_empty_string,
  value: z.unknown(),
});

export const mesa_delete_body = z.object({
  salaId: sala_id_schema,
  mesaId: mesa_id_schema,
});

export const conta_store_body = z.object({
  contaDTO: z.object({
    contaId: conta_id_schema,
    mesaId: mesa_id_schema,
    entidade: z.number(),
    nome: non_empty_string,
    morada: z.string(),
    codigoPostal: z.string(),
    localidade: z.string(),
    nif: z.string(),
    artigos: z
      .array(
        z.object({
          contaId: conta_id_schema,
          codigoArtigo: non_empty_string,
          quantidade: z.number(),
          desconto: z.number(),
        }),
      )
      .default([]),
  }),
});

export const conta_set_body = z.object({
  mesaId: mesa_id_schema,
  contaId: conta_id_schema,
  key: non_empty_string,
  value: z.unknown(),
});

export const conta_delete_body = z.object({
  mesaId: mesa_id_schema,
  contaId: conta_id_schema,
});

export const conta_artigo_body = z.object({
  mesaId: mesa_id_schema,
  contaId: conta_id_schema,
  codigoArtigo: non_empty_string,
});

export const sala_delete_body = z.object({
  salaId: sala_id_schema,
});

export const sala_new_body = z.object({
  nome: non_empty_string,
});

export const mesa_new_body = z.object({
  salaId: sala_id_schema,
  nomeMesa: non_empty_string,
});

export const conta_new_body = z.object({
  mesaId: mesa_id_schema,
  nome: non_empty_string,
});
