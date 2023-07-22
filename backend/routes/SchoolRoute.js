const express = require("express");
const router = express.Router();
const Crud = require("../services/CrudClass");
const Auth = require("../services/AuthClass");
const CrudForSchool = new Crud("SchoolModel");
const AuthUsers = new Auth();

const {
  CreatevalidateData,
  FindvalidateData,
  updatevalidateData,
  DeletevalidateData,
} = require("../utils/validations/ValidationsSchools");
//
router
  .route("/")
  .post(CreatevalidateData, CrudForSchool.createHandler.bind(CrudForSchool));

router
  .route("/:id")
  .get(FindvalidateData, CrudForSchool.readOneSchool.bind(CrudForSchool));

module.exports = router;
