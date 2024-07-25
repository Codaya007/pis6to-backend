const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const softDeletePlugin = require("../pluggins/soft-delete");

const TipoAlerta = {
  FALLA_NODO: 'FallaNodo',
  PARAMETROS_NO_SALUDABLES: 'Parametros no saludables'
};

const NivelSeveridad = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja'
};

const alertaSchema = new Schema({
  titulo: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: Object.values(TipoAlerta),
    required: true
  },
  severidad: {
    type: String,
    enum: Object.values(NivelSeveridad),
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  detalle: {
    type: Schema.Types.Mixed, // Equivalente a JSON
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  resuelta: {
    type: Boolean,
    default: false
  },
  accionesAplicadas: {
    type: String
  }
}, {
  timestamps: true // Esto añadirá automáticamente createdAt y updatedAt
});

// Aplicamos el plugin de borrado suave
alertaSchema.plugin(softDeletePlugin);

const Alerta = mongoose.model('Alerta', alertaSchema);

module.exports = Alerta;