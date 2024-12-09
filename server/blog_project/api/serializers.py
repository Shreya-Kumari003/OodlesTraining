from rest_framework import serializers
from .models import Blog, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'occupation']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'occupation']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            occupation=validated_data['occupation'],
        )
        return user
    
# class BlogSerializer(serializers.ModelSerializer):
#     author = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = Blog
#         fields = ['id', 'title', 'content', 'image', 'author', 'date_created']
#         read_only_fields = ['id', 'author', 'date_created']

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image', 'author', 'category', 'date_created']
        read_only_fields = ['id', 'author', 'date_created']


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(read_only=True)  # To display the username of the commenter
    blog = serializers.PrimaryKeyRelatedField(queryset=Blog.objects.all())  # Blog linked to the comment

    class Meta:
        model = Comment
        fields = ['id', 'username', 'content', 'date_created', 'blog']
        read_only_fields = ['id', 'username', 'date_created']