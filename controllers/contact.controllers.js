import ContactForm from "../models/contactform.models.js";

export const sendMessage = async (req, res) => {
  const { name, email, address, phone, message } = req.body;
  const data = { name, email, address, phone, message };
  try {
    await ContactForm.create(data);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const data = await ContactForm.find();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
