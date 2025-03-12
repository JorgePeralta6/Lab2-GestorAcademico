import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, asignarCourse } from "./user.controller.js"
import { existeUsuarioById } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole, eliminadoPropio, editadoPropio } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
        editadoPropio
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
        eliminadoPropio
    ],
    deleteUser
)

router.put(
    "/agregarCurso/:id",
    [
        check("id", "No es el ID correcto").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    asignarCourse
)

export default router;