import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    trim: true 
  },
  apellido: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true 
  },
  servicio: { 
    type: String, 
    required: true 
  },
  consulta: { 
    type: String, 
    trim: true 
  },
  estado: { 
    type: String, 
    enum: ['nuevo', 'contactado', 'cerrado'], 
    default: 'nuevo' 
  }
}, { 
  timestamps: true 
});

export const Contact = mongoose.model("Contact", contactSchema);