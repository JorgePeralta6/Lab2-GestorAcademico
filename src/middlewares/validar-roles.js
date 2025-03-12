import User from "../users/user.model.js"

export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero'
            })
        }
        if (!roles.includes(req.usuario.role)) {
            return res.status(400).json({
                success: false,
                msg: `Usuario no autorizado, posee un rol ${req.usuario.role}, los roles autorizados son ${roles}`
            })
        }

        next();
    }
}

export const eliminadoPropio = async(req, res, next) => {
    const { id } = req.params;
    const yourUser = req.user.id;

    try {  
        if(yourUser !== id){
            return res.status(403).json({
                success: false,
                msg: "No puede eliminar otros usuarios que no sea el suyo"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion para eliminar"
        })
    }
}

export const editadoPropio = async (req, res, next) => {
    const { id } = req.params;

    if (!req.user) {
        return res.status(401).json({
            success: false,
            msg: "No está autenticado"
        });
    }

    const yourUser = req.user.id;

    if (yourUser !== id) {
        return res.status(403).json({
            success: false,
            msg: "No puede editar otros usuarios que no sea el suyo"
        });
    }

    next();
};
