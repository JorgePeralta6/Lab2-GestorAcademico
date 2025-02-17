import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";
import Course from "../course/course.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate({ path: 'keeper', match: { status: true }, select: 'nameC description level' })
        ])

        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params
        const { _id, password, ...data } = req.body;

        if (password) {
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar user',
            error
        })
    }
}

export const updatePassword = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const data = {};

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Password update!!',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to update password',
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
        const autheticatedUser = req.user;

        res.status(200).json({
            succes: true,
            msg: 'Usuario desactivado',
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
}

export const asignarCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const course = await Course.findOne({ nameC: data.nameC });

        if (!course) {
            return res.status(404).json({
                succes: false,
                message: 'No se encontro el curso'
            })
        }

        const updatedUser = await User.findByIdAndUpdate(id).populate({ path: 'keeper', match: { status: true }, select: 'nameC description level' });
        
        if (updatedUser.keeper.length >= 3) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya tiene el máximo de 3 cursos asignados'
            });
        }

        const courseExists = updatedUser.keeper.some(item => item.nameC === course.nameC);

        if (courseExists) {
            return res.status(404).json({
                success: false,
                msg: 'Ya se encuentra asignado a este curso'
            })
        }

        updatedUser.keeper.push([course._id]);
        await updatedUser.save();

        res.status(200).json({
            success: true,
            message: 'Curso asignado correctamente',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al asignar el curso',
            error
        })
    }
}