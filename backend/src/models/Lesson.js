// backend/src/models/Lesson.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * LessonSchema
 * - Stores lesson content uploaded by teachers/authors
 * - Keeps basic meta like tags, media links and author reference
 * - Uses timestamps to track createdAt and updatedAt
 */
const LessonSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [256, "Title is too long"],
    },

    // Main lesson body (can be markdown/HTML/text)
    content: {
      type: String,
      required: [true, "Lesson content is required"],
    },

    // Simple tags for filtering / categorization
    tags: {
      type: [String],
      default: [],
      index: true,
    },

    // Reference to the author (User model)
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Array of media links (video urls, attachments stored elsewhere)
    media: {
      type: [String],
      default: [],
    },

    // Optional short description / summary for listing views
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description is too long"],
    },

    // Optional grade level, subject or metadata object for future extension
    metadata: {
      subject: { type: String },
      grade: { type: String },
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    strict: true,
    versionKey: false,
  }
);

/**
 * Indexes
 * - Text index on title + content to support simple search queries
 */
LessonSchema.index({ title: "text", content: "text" });

/**
 * Instance helpers / virtuals (example)
 * - excerpt: first 200 chars of content (useful for lists)
 */
LessonSchema.virtual("excerpt").get(function () {
  if (!this.content) return "";
  const plain = this.content.replace(/(<([^>]+)>)/gi, ""); // strip simple HTML
  return plain.length > 200 ? `${plain.slice(0, 197)}...` : plain;
});

/**
 * Pre-save hook (optional)
 * - You can add slug generation or sanitize content here if needed
 */
LessonSchema.pre("save", function (next) {
  // Example: ensure tags are unique + trimmed
  if (Array.isArray(this.tags)) {
    this.tags = [...new Set(this.tags.map((t) => String(t).trim()).filter(Boolean))];
  }
  next();
});

export default model("Lesson", LessonSchema);
