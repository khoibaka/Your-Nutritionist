from django.urls import path
from . import views
from .recipe_api import RecipeAPI
urlpatterns = [
    path('<int:recipe_id>/info', views.recipe_view),
    path('create', RecipeAPI.as_view()),
    path('', views.get_recipes)
]