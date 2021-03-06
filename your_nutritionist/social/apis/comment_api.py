from django.http import HttpResponse, JsonResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from social.models import Comment, Action
from post.models import Post
from accounts.helpers import get_profile_pic
class CommentAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
    ]

    def post(self, *args, **kwargs):
        post_id = kwargs['post_id']
        commenter = self.request.user
        content = self.request.POST.get('content')
        try:
            if(content):
                post_instance = Post.objects.get(id=post_id)
                comment_instance = Comment.objects.create(
                    content = content,
                    commenter = commenter,
                    target_id = post_id,
                    target_type = 0
                )
                Action.objects.get_or_create(
                    user=commenter,
                    action_type=6,
                    target_id = post_id
                )
                return JsonResponse(get_comment_info(comment_instance), safe=True)
            else:
                return JsonResponse({'status':'No content provided'})
        except Post.DoesNotExist:
            return JsonResponse({'status':'No Post'}, status=404)
        
    def get(self, *args, **kwargs):
        post_id = kwargs['post_id']
        if(self.request.GET.get('limit')):
            limit = int(self.request.GET.get('limit'))
        else:
            limit = 5

        if(self.request.GET.get('before_id')):
            before_id = int(self.request.GET.get('before_id'))
        else: 
            before_id = -1
        

        comment_instances = Comment.objects.filter(
            target_type = 0,
            target_id = post_id,
            id__lt = before_id
        ) if (before_id and before_id != -1
        ) else Comment.objects.filter(
            target_type = 0,
            target_id = post_id,
        )
        comment_infos = [get_comment_info(comment_instance) for comment_instance in comment_instances[:limit]]
        return JsonResponse({'comments': comment_infos}, safe=True)

class CommentInfoAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def put(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        content = self.request.POST.get('content')
        try:
            comment_instance = Comment.objects.get(id=comment_id)
            if(content):
                comment_instance.content = content
                comment_instance.save()
                return JsonResponse(get_comment_info(comment_instance), safe=True)
            else:
                return JsonResponse({'status':'No content provided'})
        except Comment.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)

    def delete(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        try:
            comment_instance = Comment.objects.get(id=comment_id)
            comment_instance.delete()
            return JsonResponse({'status': 'ok'}, safe=True)
        except Comment.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)


    def get(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        try:
            comment_instance = Comment.objects.get(id=comment_id)
            return JsonResponse(get_comment_info(comment_instance), safe=True)
        except Comment.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)

class ReplyAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
    ]

    def post(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        commenter = self.request.user
        content = self.request.POST.get('content')
        try:
            if(content):
                comment_instance = Comment.objects.get(id=comment_id)
                reply_instance = Comment.objects.create(
                    content = content,
                    commenter = commenter,
                    target_id = comment_id,
                    target_type = 1
                )
                Action.objects.get_or_create(
                    user=commenter,
                    action_type=7,
                    target_id = comment_id
                )
                return JsonResponse(get_comment_info(reply_instance), safe=True)
            else:
                return JsonResponse({'status':'No content provided'})
        except Post.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)
        
    def get(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        reply_instances = Comment.objects.filter(
            target_type = 1,
            target_id = comment_id
        )
        reply_infos = [get_comment_info(reply_instance) for reply_instance in reply_instances]
        return JsonResponse({'replies': reply_infos}, safe=True)

class ReplyInfoAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def put(self, *args, **kwargs):
        comment_id = kwargs['reply_id']
        content = self.request.POST.get('content')
        try:
            comment_instance = Comment.objects.get(id=comment_id)
            if(content):
                comment_instance.content = content
                comment_instance.save()
                return JsonResponse(get_comment_info(comment_instance), safe=True)
            else:
                return JsonResponse({'status':'No content provided'})
        except Comment.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)

    def delete(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        try:
            comment_instance = Comment.objects.get(id=comment_id)
            comment_instance.delete()
            return JsonResponse({'status': 'ok'}, safe=True)
        except Comment.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)


    def get(self, *args, **kwargs):
        comment_id = kwargs['comment_id']
        try:
            comment_instance = Comment.objects.get(id=comment_id)
            return JsonResponse(get_comment_info(comment_instance), safe=True)
        except Comment.DoesNotExist:
            return JsonResponse({'status':'No Comment'}, status=404)

def get_comment_info(comment_instance):
    comment_info = {}
    comment_info['comment_id'] = comment_instance.id
    comment_info['content'] = comment_instance.content
    comment_info['profilepic'] = get_profile_pic(comment_instance.commenter.id)
    comment_info['username'] = comment_instance.commenter.username
    comment_info['fullname'] = comment_instance.commenter.get_full_name()
    comment_info['commented_at'] = comment_instance.commented_at
    comment_info['user_id'] = comment_instance.commenter.id
    return comment_info

def get_number_of_comment_post(post_instance):
    return Comment.objects.filter(target_id=post_instance.id, target_type=0).count()
