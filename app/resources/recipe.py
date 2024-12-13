from uuid import uuid4

from flask_smorest import Blueprint, abort
from flask.views import MethodView
from pymongo import MongoClient

from app.schemas import RecipeSchema, RecipeUpdateSchema
from app.resources.db import mongoUri

blueprint = Blueprint("Recipe", "recipes", description="Operation in recipes")

client = MongoClient(mongoUri, 27017)
recipe_collection = client.admin.recipe


@blueprint.route("/hello")
class Home(MethodView):
    @blueprint.response(200)
    def get(self):
        return get_hello_db()


@blueprint.route("/recipe/<string:recipe_id>")
class Recipe(MethodView):
    @blueprint.response(200, RecipeSchema)
    def get(self, recipe_id):
        result = recipe_collection.find_one({"id": recipe_id})
        if not result:
            abort(404, message="Recipe not found")
        del result["_id"]
        return result

    @blueprint.arguments(RecipeUpdateSchema)
    @blueprint.response(200, RecipeSchema)
    def put(self, recipe_data, recipe_id):
        existing_recipe = recipe_collection.find_one({"id": recipe_id})
        if not existing_recipe:
            abort(404, message="Recipe not found")
        del existing_recipe["_id"]
        for attr in RecipeUpdateSchema.get_attr_list():
            if attr in recipe_data:
                existing_recipe[attr] = recipe_data[attr]

        recipe_collection.replace_one({"id": recipe_id}, existing_recipe)
        return existing_recipe

    @blueprint.response(200, description="Recipe deleted")
    def delete(self, recipe_id):
        delete_result = recipe_collection.delete_one({"id": recipe_id})
        deleted_count = True if delete_result.deleted_count == 1 else False
        return {"recipe": recipe_id, "deleted": deleted_count}


@blueprint.route("/recipe")
class RecipeList(MethodView):
    @blueprint.response(200, RecipeSchema(many=True))
    def get(self):
        recipes = recipe_collection.find()
        return recipes

    @blueprint.arguments(RecipeSchema)
    @blueprint.response(201, RecipeSchema)
    def post(self, recipe_data):
        recipe_id = uuid4().hex[:4]
        new_recipe = {**recipe_data, "id": recipe_id}
        recipe_collection.insert_one(new_recipe)
        return new_recipe


def get_hello_db():
    try:
        data = client.test.command('ping')
    except Exception as e:
        data = repr(e)
    return data
