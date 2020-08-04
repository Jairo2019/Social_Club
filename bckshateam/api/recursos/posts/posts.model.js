const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [
        true,
        'Post debe tener URL de la imagen donde puede ser descargada'
      ]
    },
    usuario: {
      type: ObjectId,
      required: [true, 'Post debe estar asociada a un usuario'],
      ref: 'usuario',
      index: true
    },
    caption: {
      type: String,
      maxlength: 180
    },
    numLikes: {
      type: Number,
      min: 0,
      default: 0
    },
    numComentarios: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' },
    toJSON: { virtuals: true }
  }
);

postSchema.virtual('comentarios', {
  ref: 'comentario', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'post', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { fecha_creado: 1 } } // Query options, see http://bit.ly/mongoose-query-options
});

postSchema
  .virtual('estaLike')
  .get(function() {
    if (this._estaLike == null) {
      return false;
    }

    return this._estaLike;
  })
  .set(function(v) {
    this._estaLike = v;
  });

const Post = mongoose.model('post', postSchema);

module.exports = {
  Post
};
