from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings
from .views import (
    RegisterView,
    LogoutView,
    UserDetailsView,
    BlogCreateView,
    BlogDetailView,
    BlogListView,
    UserBlogListView,
    CommentCreateView,
    CommentListView  
)

urlpatterns = [
    # User Authentication Endpoints
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserDetailsView.as_view(), name='user_details'),
    path('user/blogs/', UserBlogListView.as_view(), name='user_blog_list'),  # Get blogs of the current user
    
    # Blog Endpoints
    path('blogs/create/', BlogCreateView.as_view(), name='create_blog'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),  # Retrieve, Update, Delete
    path('blogs/', BlogListView.as_view(), name='blog_list'),  # List all blogs
    
    # Comment Endpoint
    path('blogs/<int:blog_id>/comments/', CommentCreateView.as_view(), name='create_comment'),  # Create a comment
    path('blogs/<int:blog_id>/comments/list/', CommentListView.as_view(), name='list_comments'),  # List comments for a blog

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
