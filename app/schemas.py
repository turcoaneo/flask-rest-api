from marshmallow import Schema, fields


class RecipeSchema(Schema):
    id = fields.Str()
    name = fields.Str()
    ingredients = fields.List(fields.Str(), required=True)
    instructions = fields.String(required=True)


class RecipeUpdateSchema(Schema):
    name = fields.Str()
    ingredients = fields.List(fields.Str())
    instructions = fields.String()
