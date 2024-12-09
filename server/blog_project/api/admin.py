from django.contrib import admin
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'date_created')
    search_fields = ('title', 'content')
    list_filter = ('date_created', 'author')
