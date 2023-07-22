const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const FindHelpInError = require("../utils/SomeUsefulFunction.js/HelpInError");
const { json } = require("express");
const ApiClassError = require("../utils/ApiClassError");

class CrudHelper {
  constructor(model) {
    this.model = require(`../models/${model}`);
  }

  createHandler = asyncHandler(async (req, res) => {
    if (req.body.username) {
      req.body.slug = slugify(req.body.username);
    }
    if (req.body.schoolname) {
    }
    req.body.slug = slugify(req.body.schoolname);

    const newData = await this.model.create(req.body);
    res.status(201).json(newData);
  });

  readAllHandler = asyncHandler(async (req, res) => {
    // req.body.slug = slugify(req.body.username);
    const data = await this.model.find();
    res.status(200).json({ result: data.length, data });
  });

  readOneHandler = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (FindHelpInError(id)) {
      const data = await this.model.findById(id).lean();
      if (!data) {
        console.log(`Couldn't find`);
        return next(new ApiClassError(`Couldn't find this id ${id}`, 404));
      } else {
        res.status(200).json(data);
      }
    } else {
      next(new ApiClassError(`invalid id`, 500));
    }
  });

  readOneSchool = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (FindHelpInError(id)) {
      const data = await this.model.findById(id).lean().populate("owner");
      if (!data) {
        console.log(`Couldn't find`);
        return next(new ApiClassError(`Couldn't find this id ${id}`, 404));
      } else {
        res.status(200).json(data);
      }
    } else {
      next(new ApiClassError(`invalid id`, 500));
    }
  });

  updateHandler = asyncHandler(async (req, res, next) => {
    if (req.body.username) req.body.slug = slugify(req.body.username);
    const { id } = req.params;
    if (FindHelpInError(id)) {
      const updatedData = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedData) {
        return next(new ApiClassError(`Couldn't find this id ${id}`, 404));
      } else {
        res.status(200).json(updatedData);
      }
    } else {
      next(new ApiClassError(`invalid id`, 500));
    }
  });

  deleteHandler = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (FindHelpInError(id)) {
      const deletedData = await this.model.findByIdAndDelete(id);
      if (!deletedData) {
        return next(new ApiClassError(`Couldn't find this id ${id}`, 404));
      } else {
        res.status(200).json({
          message: `user that has username ${deletedData.username} is deleted`,
        });
      }
    } else {
      next(new ApiClassError(`invalid id`, 500));
    }
  });
}

module.exports = CrudHelper;
