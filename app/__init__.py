from flask import Flask, jsonify
from flask_smorest import Api
from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint

from app.resources.recipe import blueprint as blp

app = Flask(__name__)
app.config["API_TITLE"] = "Recipes Rest API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/"
api = Api(app)


@app.route("/")
def home():
    return "Hello, world!"


@app.route('/swagger')
def get_swagger():
    swag = swagger(app)
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "My API"
    return jsonify(swag)


# Swagger UI route
SWAGGER_URL = '/swagger-ui'
API_URL = '/static/swagger.json'
swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "My API"
    }
)
api.register_blueprint(blp)
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)
