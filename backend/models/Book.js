import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
    },
    description: {
      type: String,
    },
    category: [
      {
        type: String,
      }
    ],
    publishedYear: {
      type: Number,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      }
    ],
    imageUrl: { type: String },
    imagePublicId: { type: String },
    pdfUrl: {
      type: String,
      required: true,
    },
    pdfPublicId: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
