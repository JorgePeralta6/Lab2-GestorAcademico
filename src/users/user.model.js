import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Cant be overcome 25 cheracters']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        maxLength: [25, 'Cant be overcome 25 characters '],
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: [true, 'Phone number is required']
    },
    role: {
        type: String,
        required: true,
        enum: ['TEACHER_ROLE','ALUMNO_ROLE'],
        default: "ALUMNO_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    },
    keeper:[{
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: false
    }]
},
    {
        timestamps: true,
        versionKey: false
    }
);
UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('user', UserSchema);