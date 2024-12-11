from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    occupation = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username


class Blog(models.Model):
    CATEGORY_CHOICES = [
        ('Technology', 'Technology'),
        ('Health', 'Health'),
        ('Education', 'Education'),
        ('Lifestyle', 'Lifestyle'),
        ('Business', 'Business'),
        ('Travel', 'Travel'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blogs'
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Technology',  # Set a default category
    )
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    username = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments'
    )
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    blog = models.ForeignKey(
        Blog, on_delete=models.CASCADE, related_name='comments'
    )

    def __str__(self):
        return f"Comment by {self.username} on {self.blog}"
