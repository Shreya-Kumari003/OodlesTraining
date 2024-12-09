from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import Blog, Comment
from django.contrib.auth import get_user_model
from .serializers import BlogSerializer, CommentSerializer
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.exceptions import PermissionDenied

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token to prevent further use
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()  # Save the updated user details
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # To handle image uploads

    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically set the logged-in user as the author
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class BlogListView(APIView):
#     # Allow read-only access for unauthenticated users
#     permission_classes = [IsAuthenticatedOrReadOnly]

#     def get(self, request):
#         # Get all blogs ordered by creation date
#         blogs = Blog.objects.all().order_by('-date_created')
#         serializer = BlogSerializer(blogs, many=True)
#         return Response(serializer.data, status=200)

class BlogListView(APIView):
    # Allow read-only access for unauthenticated users
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # Get the category parameter from the query string
        category = request.query_params.get('category', None)

        # Get all blogs ordered by creation date
        blogs = Blog.objects.all().order_by('-date_created')

        # Filter blogs by category if the parameter is provided
        if category:
            blogs = blogs.filter(category__iexact=category)  # Case-insensitive match for category

        # Serialize the filtered queryset
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=200)



class BlogDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, pk):
        try:
            return Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            return None

    def get(self, request, pk):
        # Allow anyone to view the blog
        blog = self.get_object(pk)
        if blog is None:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BlogSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        # Allow only the author to edit the blog
        blog = self.get_object(pk)
        if blog is None:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        if blog.author != request.user:
            raise PermissionDenied(
                "You do not have permission to edit this blog.")
        serializer = BlogSerializer(blog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Allow only the author to delete the blog
        blog = self.get_object(pk)
        if blog is None:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        if blog.author != request.user:
            raise PermissionDenied(
                "You do not have permission to delete this blog.")
        blog.delete()
        return Response({"message": "Blog deleted successfully"}, status=status.HTTP_200_OK)

class UserBlogListView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        # Get blogs written by the currently logged-in user
        blogs = Blog.objects.filter(author=request.user).order_by('-date_created')
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=200)

class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(username=request.user, blog=blog)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CommentListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        comments = Comment.objects.filter(blog=blog).order_by('-date_created')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
