from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from social.models import Action
from .recipe import create_recipe
import json
from .files import GCLOUD

class RecipeAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, *args, **kwargs):
        recipe = json.loads(self.request.POST['recipe'])
        print(self.request.FILES['image_0'].name)
        urls = GCLOUD.upload_and_return_url(self.request.user.id,self.request.FILES)
        recipe_id = create_recipe(recipe, self.request.user.id, urls)
        Action.objects.create(
            user = self.request.user,
            action_type = 3,
            target_id = recipe_id
        )
        return JsonResponse({'recipe_id': recipe_id})