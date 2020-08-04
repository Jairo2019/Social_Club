const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener un username']
    },
    password: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener una contraseña']
    },
    email: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener un email']
    },
    nombre: {
      type: String,
      minlength: 1,
      required: [true, 'Usuario debe tener nombre']
    },
    imagen: {
      type: String,
      default: null
    },
    bio: {
      type: String
    }
  },
  {
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' },
    toJSON: { virtuals: true }
  }
);

usuarioSchema.virtual('numSeguidores', {
  ref: 'amistad',
  localField: '_id',
  foreignField: 'seguidor',
  count: true
});

usuarioSchema.virtual('numSiguiendo', {
  ref: 'amistad',
  localField: '_id',
  foreignField: 'usuario',
  count: true
});

usuarioSchema
  .virtual('siguiendo')
  .get(function() {
    if (this._siguiendo == null) {
      return false;
    }

    return this._siguiendo;
  })
  .set(function(v) {
    this._siguiendo = v;
  });

module.exports = mongoose.model('usuario', usuarioSchema);
