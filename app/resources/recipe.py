import json
from uuid import uuid4

from flask_smorest import Blueprint, abort
from flask.views import MethodView

from app.schemas import RecipeSchema, RecipeUpdateSchema

blueprint = Blueprint("Recipe", "recipes", description="Operation in recipes")


@blueprint.route("/")
class Home(MethodView):
    @blueprint.response(200)
    def get(self):
        return "Hello, world!"


@blueprint.route("/recipe/<string:recipe_id>")
class Recipe(MethodView):
    @blueprint.response(200, RecipeSchema)
    def get(self, recipe_id):
        recipes = open_db()["recipes"]
        recipe = next((item for item in recipes if item["id"] == recipe_id), None)
        if not recipe:
            abort(404, message="Recipe not found")
        return recipe

    @blueprint.arguments(RecipeUpdateSchema)
    @blueprint.response(200, RecipeSchema)
    def put(self, recipe_data, recipe_id):
        recipes = open_db()["recipes"]
        existing_recipe = next((item for item in recipes if item["id"] == recipe_id), None)
        if not existing_recipe:
            abort(404, message="Recipe not found")
        for attr in RecipeUpdateSchema.get_attr_list():
            if attr in recipe_data:
                existing_recipe[attr] = recipe_data[attr]

        save_db({"recipes": recipes})
        return existing_recipe

    @blueprint.response(200, description="Recipe deleted")
    def delete(self, recipe_id):
        recipes = open_db()["recipes"]
        index = next((i for i, item in enumerate(recipes) if item["id"] == recipe_id), None)
        if not index:
            abort(404, message="Recipe not found")
        del recipes[index]
        save_db({"recipes": recipes})
        return {"message": f"Recipe deleted: {recipe_id}"}
        # return {"message": "Recipe deleted"}


@blueprint.route("/recipe")
class RecipeList(MethodView):
    @blueprint.response(200, RecipeSchema(many=True))
    def get(self):
        db = open_db()
        recipes = db["recipes"]
        return recipes

    @blueprint.arguments(RecipeSchema)
    @blueprint.response(201, RecipeSchema)
    def post(self, recipe_data):
        recipe_id = uuid4().hex[:4]
        new_recipe = {**recipe_data, "id": recipe_id}
        db = open_db()
        data = list(db["recipes"])
        data.append(new_recipe)
        save_db({"recipes": data})
        return new_recipe


def open_db():
    with open("app/db.json", "r") as jsonFile:
        data = json.load(jsonFile)
        jsonFile.close()
    return data


def save_db(data):
    with open("app/db.json", "w") as jsonFile:
        json.dump(data, jsonFile)
