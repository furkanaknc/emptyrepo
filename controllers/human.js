const Human = require("../models/Humans");

const setRelation = async (req, res) => {
  try {
    const { firstName, lastName, relation } = req.body;

    if (!["silmedi", "sildi"].includes(relation)) {
      return res.status(400).json({ msg: "Invalid relation type" });
    }
    const existingHuman = await Human.findOne({ firstName, lastName });

    if (existingHuman) {
      return res.status(400).json({
        msg: "Human with the same firstName and lastName already exists",
      });
    }

    const newHuman = new Human({
      firstName,
      lastName,
      relation,
    });

    await newHuman.save();

    return res.status(201).json({
      success: true,
      msg: "Human record created successfully",
      data: newHuman,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const updateRelation = async (req, res) => {
  try {
    const { firstName, lastName, newFirstName, newLastName, relation } =
      req.body;

    if (!["silmedi", "sildi"].includes(relation)) {
      return res.status(400).json({ msg: "Invalid relation type" });
    }

    const existingHuman = await Human.findOne({ firstName, lastName });

    if (!existingHuman) {
      return res.status(404).json({ msg: "Human record not found" });
    }

    if (newFirstName !== undefined) {
      existingHuman.firstName = newFirstName;
    }
    if (newLastName !== undefined) {
      existingHuman.lastName = newLastName;
    }
    if (relation !== undefined) {
      existingHuman.relation = relation;
    }

    await existingHuman.save();

    return res.status(200).json({
      success: true,
      msg: "Human record updated successfully",
      data: existingHuman,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const deleteHuman = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const result = await Human.deleteOne({ firstName, lastName });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Human record not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Human record deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const getHumans = async (req, res) => {
  try {
    const humans = await Human.find();
    return res.status(200).json({
      success: true,
      data: humans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const searchHuman = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const result = await Human.find({ firstName, lastName });

    if (result.length === 0) {
      return res.status(404).json({ msg: "No matching human records found" });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  setRelation,
  updateRelation,
  deleteHuman,
  getHumans,
  searchHuman,
};
