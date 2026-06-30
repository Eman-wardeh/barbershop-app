import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const AboutUs =
  mongoose.models.AboutUs ||
  mongoose.model("AboutUs", aboutUsSchema);

export default AboutUs;