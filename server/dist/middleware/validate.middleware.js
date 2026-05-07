"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.errors,
            });
        }
    };
};
exports.default = validate;
